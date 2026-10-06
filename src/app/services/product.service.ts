import { api } from '@/app/lib/api';
import { Product, Category, ProductQueryParams } from '@/app/types';

export const productService = {
  /**
   * Fetches products using central Axios client
   */
  async getProducts(params?: ProductQueryParams): Promise<Product[]> {
    const response = await api.get<Product[] | { data: Product[] }>('/products', { params });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray((response.data as { data: Product[] }).data)) {
      return (response.data as { data: Product[] }).data;
    }
    return [];
  },

  /**
   * Fetches categories using central Axios client
   */
  async getProductById(id: string): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<Category[] | { data: Category[] }>('/categories');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && Array.isArray((response.data as { data: Category[] }).data)) {
        return (response.data as { data: Category[] }).data;
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Resolves primary image URL with fallbacks
   */
  getPrimaryImageUrl(product: Product): string {
    if (!product.images || product.images.length === 0) {
      return '/images/placeholder-garment.jpg';
    }
    const primary = product.images.find((img) => img.isPrimary);
    return primary?.url || product.images[0]?.url || '/images/placeholder-garment.jpg';
  },
};