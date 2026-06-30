import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PaginatedResult } from "../../shared/pagination.types";
import { CreateCategoryInput } from "../dto/create-category.dto";
import { CategoryEntity } from "../entities/category.entity";

import { CategoriesRepository } from "./categories.repository";
import { UpdateCategoryInput } from "../dto/update-category.dto";

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

    async update(id:number, dto: UpdateCategoryInput): Promise<CategoryEntity> {
        const category = await this.categoriesRepo.preload({ id, ...dto });
        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }
        return this.categoriesRepo.save(category);
    }

    async delete(category: CategoryEntity): Promise<CategoryEntity> {
        return this.categoriesRepo.remove(category);
    }
}