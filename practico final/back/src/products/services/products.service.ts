import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PaginatedResult } from '../../shared/pagination.types';
import { PaginationInput } from '../../shared/pagination.types';
import { CreateProductInput } from '../dto/create-product.dto';
import { UpdateProductInput } from '../dto/update-product.dto';
import { ProductStockDto } from '../dto/product-stock.dto';

import { ProductEntity } from '../entities/product.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';

import { PRODUCTS_REPOSITORY, ProductsRepository } from '../repositories/products.repository';
import { CategoriesService } from '../../categories/services/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,

    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService
  ) {}

  async findAll(pagination: PaginationInput, name?: string, orderBy?: 'id' | 'price' | 'name' | 'stock', order?: 'asc' | 'desc'): Promise<PaginatedResult<ProductEntity>> {
    const page = Math.max(pagination.page || 1, 1);
    const limit = Math.min(Math.max(pagination.limit || 1, 1), 50);
    
    return this.productsRepository.findAll(page, limit, name, orderBy, order);
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findProductsByCategory(id: number): Promise<ProductEntity[]> {
    return this.productsRepository.findProductsByCategory(id);
  }

  async create(input: CreateProductInput): Promise<ProductEntity> {
    if (input.categoryId !== undefined) {
      try {
        await this.categoriesService.findOne(input.categoryId);
      } catch {
        throw new BadRequestException(`No existe categoría con ID: ${input.categoryId}`);
      }
    }

    const { categoryId, ...productData } = input;
    
    return this.productsRepository.create({
      ...productData,
      category: categoryId ? { id: categoryId } as CategoryEntity : undefined
    });
  }

  async update(id: number, input: UpdateProductInput): Promise<ProductEntity> {
    const product = await this.findOne(id);
    return this.productsRepository.update(product, input);
  }

  async updateStock(id: number, input: ProductStockDto): Promise<ProductEntity> {
    const product = await this.findOne(id);

    if (input.quantity > product.stock) {
      throw new BadRequestException('Stock insuficiente');
    }
    
    return this.productsRepository.updateStock(product, input);
  }

  async delete(id: number): Promise<ProductEntity> {
    const product = await this.findOne(id);
    return this.productsRepository.delete(product);
  }
}

