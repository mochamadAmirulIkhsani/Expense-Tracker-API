import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    userId: number,
    dto: CreateTransactionDto,
  ) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id: dto.categoryId,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    if (category.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.transaction.create({
      data: {
        title: dto.title,
        amount: dto.amount,
        description: dto.description,
        date: new Date(dto.date),
        type: dto.type,
        categoryId: dto.categoryId,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },

      include: {
        category: true,
      },

      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(
    userId: number,
    transactionId: number,
  ) {
    const transaction =
      await this.prisma.transaction.findUnique({
        where: {
          id: transactionId,
        },
        include: {
          category: true,
        },
      });

    if (!transaction) {
      throw new NotFoundException();
    }

    if (
      transaction.userId !== userId
    ) {
      throw new ForbiddenException();
    }

    return transaction;
  }

  async update(
    userId: number,
    transactionId: number,
    dto: UpdateTransactionDto,
  ) {
    await this.findOne(
      userId,
      transactionId,
    );

    return this.prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        ...dto,
        date: dto.date
          ? new Date(dto.date)
          : undefined,
      },
    });
  }

  async remove(
    userId: number,
    transactionId: number,
  ) {
    await this.findOne(
      userId,
      transactionId,
    );

    return this.prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });
  }
}