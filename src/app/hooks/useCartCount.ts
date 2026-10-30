'use client';

import { useEffect, useState } from 'react';
import { api } from '@/app/lib/api';
import { CartItem } from '@/app/types';

const LOCAL_CART_KEY = 'na_garments_cart';

interface BackendCartResponse {
  data: {
    items: CartItem[];
  };
}

function getStoredRole(): string | null {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    const user = JSON.parse(storedUser) as { role?: string };
    return user.role?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

function getGuestCartCount(): number {
  try {
    const storedCart = localStorage.getItem(LOCAL_CART_KEY);
    if (!storedCart) return 0;

    const cart = JSON.parse(storedCart) as CartItem[];

    return cart.reduce(
      (total, item) =>
        total + (Number.isFinite(item.quantity) ? item.quantity : 0),
      0
    );
  } catch {
    return 0;
  }
}

function getItemsCount(items: CartItem[]): number {
  return items.reduce(
    (total, item) =>
      total + (Number.isFinite(item.quantity) ? item.quantity : 0),
    0
  );
}

export function useCartCount() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let active = true;

    const updateCartCount = async () => {
      const token = localStorage.getItem('token');
      const role = getStoredRole();

      if (role === 'ADMIN') {
        setCartCount(0);
        return;
      }

      if (!token) {
        setCartCount(getGuestCartCount());
        return;
      }

      try {
        const response = await api.get<BackendCartResponse>('/cart');
        if (!active) return;

        setCartCount(getItemsCount(response.data.data.items ?? []));
      } catch {
        if (active) setCartCount(0);
      }
    };

    void updateCartCount();

    window.addEventListener('cart_updated', updateCartCount);
    window.addEventListener('auth_updated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      active = false;
      window.removeEventListener('cart_updated', updateCartCount);
      window.removeEventListener('auth_updated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return cartCount;
}