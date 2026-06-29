import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { PaginatedResult } from "../../shared/pagination.types";

import { ProductStockDto } from "../dto/product-stock.dto";
import { UpdateProductInput } from "../dto/update-product.dto";
import { ProductEntity } from "../entities/product.entity";
import { CategoryEntity } from "../../categories/entities/category.entity";

import { ProductsRepository } from "./products.repository";


export class TypeOrmProductsRepository implements ProductsRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productsRepo: Repository<ProductEntity>
    ) {}

    async findAll(page: number, limit: number, name?: string, orderBy?: 'id' | 'price' | 'name' | 'stock', order?: 'ASC' | 'DESC'): Promise<PaginatedResult<ProductEntity>> {
        const start = (page - 1) * limit;

        const [data, total] = await this.createQueryProducts(name, orderBy, order)
                                        .take(limit)
                                        .skip(start)
                                        .getManyAndCount();

        return {
            items: data,
            page,
            limit,
            total
        };
    }

    async findById(id: number): Promise<ProductEntity | null> {
        return this.productsRepo.findOne({ where: { id }, relations: ['category'] });
    }

    async findProductsByCategory(id: number): Promise<ProductEntity[]> {
        return this.productsRepo.find({
            where: {
                category: { id }
            }
        });
    }

    async create(input: DeepPartial<ProductEntity>): Promise<ProductEntity> {
        const product = this.productsRepo.create(input);
        return this.productsRepo.save(product);
    }

    async update(product: ProductEntity, input: UpdateProductInput): Promise<ProductEntity> {
        const { categoryId, ...rest } = input;

        this.productsRepo.merge(product, rest);

        if (categoryId !== undefined) {
            product.category = { id: categoryId } as CategoryEntity;
        }

        return this.productsRepo.save(product);
    }

    async updateStock(product: ProductEntity, input: ProductStockDto): Promise<ProductEntity> {
        product.stock -= input.quantity;
        return this.productsRepo.save(product);
    }
    
    async delete(product: ProductEntity): Promise<ProductEntity> {
        return this.productsRepo.remove(product);
    }

    private createQueryProducts(name?: string, orderBy?: 'id' | 'price' | 'name' | 'stock', order?: 'ASC' | 'DESC') {
        const query = this.productsRepo.createQueryBuilder('product')
                                        .innerJoinAndSelect('product.category', 'category');

        if (name) {
            query.where('LOWER(product.name) LIKE :name', { name: `%${name.toLowerCase()}%` });
        }

        if (orderBy) {
            query.orderBy(`product.${orderBy}`, order === 'ASC' ? 'ASC' : 'DESC');
        }
        
        return query;
    }
}