import { api } from '@/app/lib/api';
import type { AdminCartListResponse } from '@/app/types/admin-cart';

export const adminCartService = {
  async getAllCarts(): Promise<AdminCartListResponse> {
    const response = await api.get<AdminCartListResponse>('/admin/carts');
    return response.data;
  },
};
