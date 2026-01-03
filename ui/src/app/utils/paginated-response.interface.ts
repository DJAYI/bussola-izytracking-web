export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface PaginationParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}
