import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PaginatedResult } from '../../shared/pagination.types';
import { PaginationInput } from '../../shared/pagination.types';
import { CreateCategoryInput } from '../dto/create-category.dto';

import { ProductEntity } from '../../products/entities/product.entity';
import { CategoryEntity } from '../entities/category.entity';

import { CATEGORIES_REPOSITORY, CategoriesRepository } from '../repositories/categories.repository';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class CategoriesService {
    constructor(
        @Inject(CATEGORIES_REPOSITORY)
        private readonly categoriesRepo: CategoriesRepository,

        @Inject(forwardRef(() => ProductsService))
        private readonly productsService: ProductsService
    ) {}

    async findAll(): Promise<CategoryEntity[]> {
        return this.categoriesRepo.findAll();
    }

    async findOne(id: number): Promise<CategoryEntity> {
        const category = await this.categoriesRepo.findById(id);

        if (!category) {
            throw new NotFoundException(`Category con ID: ${id} no encontrada`);
        }

        return category;
    }

    async create(dto: CreateCategoryInput): Promise<CategoryEntity> {
        return this.categoriesRepo.create(dto);
    }

    async delete(id: number): Promise<CategoryEntity> {
        const category = await this.findOne(id);

        const products = await this.findProductsByCategory(id);
        const hasProducts = products.length > 0;
        if (hasProducts) {
            throw new ConflictException('No se puede eliminar una categoría que tiene productos asociados');
        }

        this.categoriesRepo.delete(category);
        return category;
    }

    async findProductsByCategory(id: number): Promise<ProductEntity[]> {
        return this.productsService.findProductsByCategory(id);
    }
}