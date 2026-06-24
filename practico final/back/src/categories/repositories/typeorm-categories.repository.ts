import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PaginatedResult } from "../../shared/pagination.types";
import { CreateCategoryInput } from "../dto/create-category.dto";
import { CategoryEntity } from "../entities/category.entity";

import { CategoriesRepository } from "./categories.repository";

export class TypeOrmCategoriesRepository implements CategoriesRepository {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoriesRepo: Repository<CategoryEntity>
    ) {}

    async findAll(name?: string, order?: 'asc' | 'desc'): Promise<CategoryEntity[]> {
        return this.createQueryCategory(name, order).getMany();
    }

    async findPaginated(page: number, limit: number, name?: string, order?: 'asc' | 'desc'): Promise<PaginatedResult<CategoryEntity>> {
        const start = (page - 1) * limit;

        const [data, total] = await this.createQueryCategory(name, order)
                                        .take(limit)
                                        .skip(start)
                                        .getManyAndCount();
        
        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }

    async findById(id: number): Promise<CategoryEntity | null> {
        return this.categoriesRepo.findOneBy({ id });
    }

    async create(dto: CreateCategoryInput): Promise<CategoryEntity> {
        const category = this.categoriesRepo.create(dto);
        return this.categoriesRepo.save(category);
    }

    async delete(category: CategoryEntity): Promise<CategoryEntity> {
        return this.categoriesRepo.remove(category);
    }

    private createQueryCategory(name?: string, order?: 'asc' | 'desc') {
        const query = this.categoriesRepo.createQueryBuilder('category');

        if (name) {
            query.where('LOWER(category.name) LIKE :name', { name: `%${name.toLowerCase()}%` });
        }

        if (order) {
            query.orderBy('category.name', order === 'asc' ? 'ASC' : 'DESC');
        }

        return query;
    }
}