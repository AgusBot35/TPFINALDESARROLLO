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

    async findAll(): Promise<CategoryEntity[]> {
        return this.categoriesRepo.find();
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
}