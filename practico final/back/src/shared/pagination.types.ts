export type PaginatedResult<T> = {
    items: T[];
    page: number;
    limit: number;
    total: number;
    
};

export type PaginationInput = {
    page?: number;
    limit?: number;
};