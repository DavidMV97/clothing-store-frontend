export interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    value: number;
    stock: number;
    description: string;
    productImage: string;
    creationDate?: string;
    updatedAt?: string;
    __v?: number;
    productImageUrl?: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface ProductsApiResponse {
    products: Product[];
    pagination: Pagination;
}