import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { TransactionType } from '../../../generated/prisma/client';

export class CreateTransactionDto {
  @IsString()
  title!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsNumber()
  categoryId!: number;
}