import { PaginatedResult } from "../../shared/pagination.types";

import { CreateCategoryInput } from "../dto/create-category.dto";
import { UpdateCategoryInput } from "../dto/update-category.dto";
import { CategoryEntity } from "../entities/category.entity";


export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategoriesRepository {
    findAll(): Promise<CategoryEntity[]>;
    findById(id: number): Promise<CategoryEntity | null>;
    findByName(name: string): Promise<CategoryEntity | null>
    create(dto: CreateCategoryInput): Promise<CategoryEntity>;
    update(id: number, dto: UpdateCategoryInput): Promise<CategoryEntity>;
    delete(category: CategoryEntity): Promise<CategoryEntity>;
}