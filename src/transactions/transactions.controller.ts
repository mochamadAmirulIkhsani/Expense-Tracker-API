import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TransactionsService } from './transactions.service';

import { JwtGuard } from '../auth/jwt/jwt.guard';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@UseGuards(JwtGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post()
  create(
    @Req() req,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(
      req.user.id,
      dto,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.transactionsService.findAll(
      req.user.id,
    );
  }

  @Get(':id')
  findOne(
    @Req() req,
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.transactionsService.findOne(
      req.user.id,
      id,
    );
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id', ParseIntPipe)
    id: number,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(
      req.user.id,
      id,
      dto,
    );
  }

  @Delete(':id')
  remove(
    @Req() req,
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.transactionsService.remove(
      req.user.id,
      id,
    );
  }
}