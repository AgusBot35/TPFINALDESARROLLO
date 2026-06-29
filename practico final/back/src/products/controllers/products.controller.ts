import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRol } from '../../auth/types/user-role.enum';

import { CreateProductInput } from '../dto/create-product.dto';
import { UpdateProductInput } from '../dto/update-product.dto';
import { ProductStockDto } from '../dto/product-stock.dto';

import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) {}

  @Get()
  async findAll(
    @Query('name') name: string,
    @Query('sortBy') sortBy: 'id' | 'price' | 'name' | 'stock',
    @Query('order') order: 'ASC' | 'DESC',
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const parsedPage = Number(page ?? '1');
    const parsedLimit = Number(limit ?? '100');
    return this.productsService.findAll({ page: parsedPage, limit: parsedLimit}, name, sortBy, order);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRol.ADMIN)
  async create(@Body() body: CreateProductInput) {
    return this.productsService.create(body);
  }
  
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRol.ADMIN)
  async update(@Param('id') id: string, @Body() body: UpdateProductInput) {
    return this.productsService.update(Number(id), body);
  }
  
  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRol.ADMIN)
  async disminuirStock(@Param('id') id: string, @Body() body: ProductStockDto) {
    return this.productsService.updateStock(Number(id), body);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRol.ADMIN)
  async delete(@Param('id') id: string) {
    return this.productsService.delete(Number(id));
  }
}