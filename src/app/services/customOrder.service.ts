
import { CustomOrderFormData } from '@/app/types/custom-order';
import { api } from '../lib/api';

export const customOrderService = {
  create: async (data: CustomOrderFormData) => {
    const response = await api.post('/custom-orders', {
      ...data,
      quantity: Number(data.quantity),
      ...(data.productId ? { productId: data.productId } : {}),
    });
    return response.data;
  },
};