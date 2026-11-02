import { api } from '@/app/lib/api';
import type { AdminCartListResponse } from '@/app/types/admin-cart';

interface AdminCartActionResponse {
  success: boolean;
  message: string;
}

export const adminCartService = {
  async getAllCarts(): Promise<AdminCartListResponse> {
    const response = await api.get<AdminCartListResponse>('/admin/carts');
    return response.data;
  },

  async removeCustomerCartItem(
    userId: string,
    itemId: string,
  ): Promise<AdminCartActionResponse> {
    const response = await api.delete<AdminCartActionResponse>(
      `/admin/carts/${userId}/items/${itemId}`,
    );
    return response.data;
  },

  async clearCustomerCart(
    userId: string,
  ): Promise<AdminCartActionResponse> {
    const response = await api.delete<AdminCartActionResponse>(
      `/admin/carts/${userId}/items`,
    );
    return response.data;
  },
};
