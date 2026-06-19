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

import { CategoriesService } from './categories.service';

import { JwtGuard } from '../auth/jwt/jwt.guard';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(JwtGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  create(
    @Req() req,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(
      req.user.id,
      dto,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.categoriesService.findAll(
      req.user.id,
    );
  }

  @Get(':id')
  findOne(
    @Req() req,
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.categoriesService.findOne(
      req.user.id,
      id,
    );
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id', ParseIntPipe)
    id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(
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
    return this.categoriesService.remove(
      req.user.id,
      id,
    );
  }
}