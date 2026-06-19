import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    userId: number,
    dto: CreateCategoryDto,
  ) {
    if (await this.prisma.category.findFirst({
      where: {
        userId,
        name: dto.name,
      },
    })) {
      throw new ForbiddenException('Category already exists');
    }

    return this.prisma.category.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(
    userId: number,
    categoryId: number,
  ) {
    const category =
      await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

    if (!category) {
      throw new NotFoundException();
    }

    if (category.userId !== userId) {
      throw new ForbiddenException();
    }

    return category;
  }

  async update(
    userId: number,
    categoryId: number,
    dto: UpdateCategoryDto,
  ) {
    await this.findOne(
      userId,
      categoryId,
    );

    if (await this.prisma.category.findFirst({
      where: {
        userId,
        name: dto.name,
      },
    })) {
      throw new ForbiddenException('Category already exists');
    }

    return this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: dto,
    });
  }

  async remove(
    userId: number,
    categoryId: number,
  ) {
    await this.findOne(
      userId,
      categoryId,
    );

    return this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}