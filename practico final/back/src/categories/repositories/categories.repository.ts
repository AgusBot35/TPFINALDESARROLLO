import { PaginatedResult } from "../../shared/pagination.types";

import { CreateCategoryInput } from "../dto/create-category.dto";
import { CategoryEntity } from "../entities/category.entity";


export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategoriesRepository {
    findAll(name?: string, order?: 'asc' | 'desc'): Promise<CategoryEntity[]>;
    findPaginated(page: number, limit: number, name?: string, order?: 'asc' | 'desc'): Promise<PaginatedResult<CategoryEntity>>;
    findById(id: number): Promise<CategoryEntity | null>;
    create(dto: CreateCategoryInput): Promise<CategoryEntity>;
    delete(category: CategoryEntity): Promise<CategoryEntity>;
}