import { api } from '@/app/lib/api';
import {
  AdminCustomOrder,
  UpdateCustomOrderStatusData,
} from '@/app/types/admin-custom-order';

export const adminCustomOrderService = {
  getAll: async (): Promise<AdminCustomOrder[]> => {
    const response = await api.get('/custom-orders');

    return response.data;
  },

  getById: async (id: string): Promise<AdminCustomOrder> => {
    const response = await api.get(`/custom-orders/${id}`);

    return response.data;
  },

  updateStatus: async (
    id: string,
    data: UpdateCustomOrderStatusData
  ): Promise<AdminCustomOrder> => {
    const response = await api.patch(
      `/custom-orders/${id}/status`,
      data
    );

    return response.data;
  },
};