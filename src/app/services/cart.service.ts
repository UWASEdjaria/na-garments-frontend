import { api } from '@/app/lib/api';
import { CartItem, Product } from '@/app/types';

const LOCAL_CART_KEY = 'na_garments_cart';

export const cartService = {
  /**
   * Fetches cart items from authenticated backend endpoint or falls back to local storage
   */
  async getCart(): Promise<CartItem[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        const response = await api.get<CartItem[]>('/cart');
        return response.data;
      } catch {
        return this.getLocalCart();
      }
    }
    return this.getLocalCart();
  },

  /**
   * Adds an item using backend API when logged in or local storage for guest browsing
   */
  async addToCart(
    product: Product,
    quantity = 1,
    size?: string | null,
    color?: string | null
  ): Promise<CartItem[]> {
    const itemSize = size ?? (product.sizes?.[0] || null);
    const itemColor = color ?? (product.colors?.[0] || null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      try {
        await api.post('/cart', {
          productId: product.id,
          quantity,
          size: itemSize,
          color: itemColor,
        });
        return await this.getCart();
      } catch {
        return this.addToLocalCart(product, quantity, itemSize, itemColor);
      }
    }

    return this.addToLocalCart(product, quantity, itemSize, itemColor);
  },

  getLocalCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LOCAL_CART_KEY);
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch {
      return [];
    }
  },

  addToLocalCart(
    product: Product,
    quantity: number,
    size?: string | null,
    color?: string | null
  ): CartItem[] {
    const cart = this.getLocalCart();
    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.size === size &&
        item.color === color
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        productId: product.id,
        product,
        quantity,
        size,
        color,
      });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event('cart_updated'));
    }

    return cart;
  },
};