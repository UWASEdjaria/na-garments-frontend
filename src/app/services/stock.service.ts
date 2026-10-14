import { api } from '@/app/lib/api';
import { StockMutationData, StockPage, StockQueryParams } from '@/app/types';

export const stockService = {
  async getStock(params: StockQueryParams): Promise<StockPage> {
    const response = await api.get<StockPage>('/stock', { params });
    return response.data;
  },

  async addStock(data: StockMutationData): Promise<void> {
    await api.post('/stock', data);
  },

  async updateStock(id: string, data: StockMutationData): Promise<void> {
    await api.put(`/stock/${id}`, data);
  },

  async deleteStock(id: string): Promise<void> {
    await api.delete(`/stock/${id}`);
  },
};