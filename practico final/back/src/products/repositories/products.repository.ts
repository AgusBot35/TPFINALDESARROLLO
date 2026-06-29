import { DeepPartial } from 'typeorm';

import { PaginatedResult } from '../../shared/pagination.types';
import { UpdateProductInput } from '../dto/update-product.dto';
import { ProductEntity } from '../entities/product.entity';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  findAll(page: number, limit: number, name?: string, orderBy?: 'id' | 'price' | 'name' | 'stock', order?: 'ASC' | 'DESC'): Promise<PaginatedResult<ProductEntity>>;
  findById(id: number): Promise<ProductEntity | null>;
  findProductsByCategory(id: number): Promise<ProductEntity[]>;
  create(input: DeepPartial<ProductEntity>): Promise<ProductEntity>;
  update(product: ProductEntity, input: UpdateProductInput): Promise<ProductEntity>;
  updateStock(product: ProductEntity, input: { quantity: number }): Promise<ProductEntity>;
  delete(product: ProductEntity): Promise<ProductEntity>;
}