'use client';

import { useEffect, useState } from 'react';

export function useCartCount() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = localStorage.getItem('na_garments_cart');

      if (!storedCart) {
        setCartCount(0);
        return;
      }

      try {
        const cart = JSON.parse(storedCart);

        const totalQuantity = cart.reduce(
          (total: number, item: { quantity: number }) =>
            total + item.quantity,
          0
        );

        setCartCount(totalQuantity);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();

    window.addEventListener('cart_updated', updateCartCount);

    return () => {
      window.removeEventListener('cart_updated', updateCartCount);
    };
  }, []);

  return cartCount;
}