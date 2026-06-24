import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRol } from '../../auth/types/user-role.enum';
import { Roles } from '../../common/decorators/roles.decorator';

import { CreateCategoryInput } from '../dto/create-category.dto';

import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @Get()
    async findAll(
        @Query('name') name?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        if (page !== undefined || limit !== undefined) {
            return this.categoriesService.findPaginated({
                page: Number(page),
                limit: Number(limit)
            }, name, order);
        }
        return this.categoriesService.findAll(name, order);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(Number(id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRol.ADMIN)
    @Post()
    async create(@Body() body: CreateCategoryInput) {
        return this.categoriesService.create(body);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRol.ADMIN)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.categoriesService.delete(Number(id));
    }

    @Get(':id/products')
    async findProducts(@Param('id') id: string) {
        return this.categoriesService.findProductsByCategory(Number(id));
    }
}