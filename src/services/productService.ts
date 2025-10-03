import { env } from '@/constants/env';
import axios from 'axios';
import productsMock from '@/mocks/productsMock';

export interface Product {
    _id: string;
    product_name: string;
    slug: string;
    price: number;
    discount: number;
    thumbnail: string;
    model_year: number;
    description?: string;
    specs?: Record<string, string>;
    images?: string[];
    reviews?: { user: string; rating: number; comment: string }[];
    relatedProducts?: Product[];
}

export interface ProductResponse {
    products: Product[];
    page: number;
    limit: number;
    totalRecords: number;
}

export const getProductHome = async ({
    catId,
    limit = 5
}: {catId: string, limit?: number}): Promise<Product[]> => {
    if (!env.BACKEND_URL_API) {
        return productsMock.slice(0, limit);
    }
    try {
        const response = await axios.get(`${env.BACKEND_URL_API}/v1/products/home/${catId}?limit=${limit}`);
        return response.data.data;
    } catch {
        return productsMock.slice(0, limit);
    }
};

export const getProductByCategorySlug = async (slug: string): Promise<ProductResponse> => {
    const response = await axios.get(`${env.BACKEND_URL_API}/v1/products/category/${slug}`);
    return response.data.data;
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
    if (!env.BACKEND_URL_API) {
        const p = productsMock.find(p => p.slug === slug);
        return Promise.resolve((p ?? productsMock[0]) as Product);
    }
    try {
        const response = await axios.get(`${env.BACKEND_URL_API}/v1/products/${slug}`);
        return response.data.data;
    } catch {
        const p = productsMock.find(p => p.slug === slug);
        return (p ?? productsMock[0]) as Product;
    }
};
