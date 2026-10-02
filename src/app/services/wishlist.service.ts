import { api } from '../lib/api';
import { WishlistResponse } from '../types/wishlist';

export const wishlistService = {
  async getWishlist(): Promise<WishlistResponse> {
    const response = await api.get<WishlistResponse>('/wishlist');
    return response.data;
  },

  async addItem(productId: string): Promise<WishlistResponse> {
    const response = await api.post<WishlistResponse>(`/wishlist/${productId}`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('wishlist_updated'));
    }
    return response.data;
  },

  async removeItem(productId: string): Promise<WishlistResponse> {
    const response = await api.delete<WishlistResponse>(`/wishlist/${productId}`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('wishlist_updated'));
    }
    return response.data;
  },
};