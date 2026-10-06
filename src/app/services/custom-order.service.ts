import { api } from '@/app/lib/api';
import {
  CreateCustomOrderRequest,
  CustomOrder,
} from '@/app/types/custom-order';

export const customOrderService = {
  async createCustomOrder(
    data: CreateCustomOrderRequest
  ): Promise<CustomOrder> {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: CustomOrder;
    }>('/custom-orders', data);

    return response.data.data;
  },

  async getMyCustomOrders(): Promise<CustomOrder[]> {
    const response = await api.get<CustomOrder[]>('/custom-orders/my');

    return response.data;
  },

  async getCustomOrderById(id: string): Promise<CustomOrder> {
    const response = await api.get<CustomOrder>(`/custom-orders/${id}`);

    return response.data;
  },
};