import { api } from '@/app/lib/api';
import { Product, Category, CategoryMutationData, ProductMutationData, ProductOptions, ProductPage, ProductQueryParams } from '@/app/types';

const toFormData = (data: ProductMutationData): FormData => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('slug', data.slug);
  formData.append('description', data.description);
  formData.append('price', data.price === null ? '' : String(data.price));
  formData.append('categoryId', data.categoryId);
  formData.append('minimumStockLevel', String(data.minimumStockLevel));
  formData.append('maximumStockLevel', String(data.maximumStockLevel));
  formData.append('sizes', JSON.stringify(data.sizes));
  formData.append('colors', JSON.stringify(data.colors));
  formData.append('isAvailable', String(data.isAvailable));
  formData.append('productType', data.productType);
  if (data.imageUrl) formData.append('imageUrl', data.imageUrl);
  if (data.image) formData.append('image', data.image);
  return formData;
};

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

  async getAllProducts(params?: ProductQueryParams): Promise<Product[]> {
    const firstResponse = await api.get<ProductPage>('/products', {
      params: { ...params, page: 1, limit: 100 },
    });

    const firstPage = firstResponse.data;
    const products = [...firstPage.data];
    const totalPages = firstPage.totalPages;

    for (let page = 2; page <= totalPages; page++) {
      const response = await api.get<ProductPage>('/products', {
        params: { ...params, page, limit: 100 },
      });

      products.push(...response.data.data);
    }

    return products;
  },
  async getAdminProducts(params: ProductQueryParams): Promise<ProductPage> {
    const response = await api.get<ProductPage>('/products', { params });
    return response.data;
  },

  async getOptions(): Promise<ProductOptions> {
    const response = await api.get<ProductOptions>('/products/options');
    return response.data;
  },

  async createProduct(data: ProductMutationData): Promise<Product> {
    const response = await api.post<Product>('/products', toFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updateProduct(id: string, data: ProductMutationData): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, toFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async toggleAvailability(id: string): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}/availability`);
    return response.data;
  },

  /**
   * Fetches categories using central Axios client
   */
  async getProductById(id: string): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async getCategories(search?: string): Promise<Category[]> {
    const response = await api.get<Category[] | { data: Category[] }>('/categories', { params: { search } });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray((response.data as { data: Category[] }).data)) {
      return (response.data as { data: Category[] }).data;
    }
    return [];
  },

  async createCategory(data: CategoryMutationData): Promise<Category> {
    const response = await api.post<{ data: Category }>('/categories', data);
    return response.data.data;
  },

  async updateCategory(id: string, data: CategoryMutationData): Promise<Category> {
    const response = await api.put<{ data: Category }>(`/categories/${id}`, data);
    return response.data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
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
