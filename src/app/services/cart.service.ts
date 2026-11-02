import { api } from '@/app/lib/api';
import { CartItem, Product } from '@/app/types';

const LOCAL_CART_KEY = 'na_garments_cart';

interface BackendCartResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    userId: string;
    items: CartItem[];
  };
}

function getStoredToken(): string | null {
  return typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;
}

function getStoredRole(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    const user = JSON.parse(storedUser) as { role?: string };
    return user.role?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

function notifyCartUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart_updated'));
  }
}

function ensureCustomerCart(): void {
  if (getStoredRole() === 'ADMIN') {
    throw new Error('Administrators cannot use the customer cart.');
  }
}

function normalizeCartOption(value?: string | null): string | null {
  const normalized = value?.trim();

  if (
    !normalized ||
    /^(string|null|undefined)$/i.test(normalized)
  ) {
    return null;
  }

  return normalized;
}
export const cartService = {
  async getCart(): Promise<CartItem[]> {
    const token = getStoredToken();

    if (!token) {
      return this.getLocalCart();
    }

    ensureCustomerCart();

    const response = await api.get<BackendCartResponse>('/cart');
    return response.data.data.items ?? [];
  },

  async addToCart(
    product: Product,
    quantity = 1,
    size?: string | null,
    color?: string | null
  ): Promise<CartItem[]> {
    const itemSize =
      normalizeCartOption(size) ??
      normalizeCartOption(product.sizes?.[0]);

    const itemColor =
      normalizeCartOption(color) ??
      normalizeCartOption(product.colors?.[0]);
    const token = getStoredToken();

    if (!token) {
      return this.addToLocalCart(product, quantity, itemSize, itemColor);
    }

    ensureCustomerCart();

    await api.post('/cart/items', {
      productId: product.id,
      quantity,
      size: itemSize,
      color: itemColor,
    });

    const items = await this.getCart();
    notifyCartUpdated();

    return items;
  },

  async mergeGuestCart(): Promise<CartItem[]> {
    const token = getStoredToken();

    if (!token) {
      throw new Error('Sign in before merging the guest cart.');
    }

    ensureCustomerCart();

    const guestItems = this.getLocalCart();

    if (guestItems.length === 0) {
      return this.getCart();
    }

    await api.post('/cart/merge', guestItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size ?? null,
      color: item.color ?? null,
    })));

    localStorage.removeItem(LOCAL_CART_KEY);
    notifyCartUpdated();

    return this.getCart();
  },
  getLocalCart(): CartItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(LOCAL_CART_KEY);
      if (!stored) return [];

      const cart = JSON.parse(stored) as CartItem[];

      const normalizedCart = cart.map((item) => ({
        ...item,
        size: normalizeCartOption(item.size),
        color: normalizeCartOption(item.color),
      }));

      if (JSON.stringify(cart) !== JSON.stringify(normalizedCart)) {
        localStorage.setItem(
          LOCAL_CART_KEY,
          JSON.stringify(normalizedCart)
        );
      }

      return normalizedCart;
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
      notifyCartUpdated();
    }

    return cart;
  },
};