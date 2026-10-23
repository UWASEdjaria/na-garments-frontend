'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { cartService } from '@/app/services/cart.service';
import { api } from '@/app/lib/api';
import { productService } from '@/app/services/product.service';
import { useCurrency } from '@/app/components/CurrencyProvider';
import { useToast } from '@/app/components/ToastProvider';
import type { CartItem } from '@/app/types';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { format } = useCurrency();
  const { showToast } = useToast();

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    const cart = await cartService.getCart();
    setItems(cart);
    setIsLoading(false);
  }, []);

  useEffect(() => { void loadCart(); }, [loadCart]);

  const updateQuantity = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    try {
      const token = localStorage.getItem('token');

      if (token && item.id && !item.id.startsWith('local-')) {
        await api.put(`/cart/items/${item.id}`, { quantity: newQty });
        await loadCart();
      } else {
        const stored = cartService.getLocalCart();
        const updated = stored.map((i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.color === item.color
            ? { ...i, quantity: newQty }
            : i
        );

        localStorage.setItem('na_garments_cart', JSON.stringify(updated));
        window.dispatchEvent(new Event('cart_updated'));
        setItems(updated);
      }

      showToast({
        type: 'success',
        title: 'Cart updated',
        description: 'The product quantity was updated.',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Could not update cart',
        description: 'Please try again.',
      });
    }
  };

  const removeItem = async (item: CartItem) => {
    try {
      const token = localStorage.getItem('token');

      if (token && item.id && !item.id.startsWith('local-')) {
        await api.delete(`/cart/items/${item.id}`);
        await loadCart();
      } else {
        const stored = cartService.getLocalCart();
        const updated = stored.filter(
          (i) =>
            !(i.productId === item.productId &&
              i.size === item.size &&
              i.color === item.color)
        );

        localStorage.setItem('na_garments_cart', JSON.stringify(updated));
        window.dispatchEvent(new Event('cart_updated'));
        setItems(updated);
      }

      showToast({
        type: 'success',
        title: 'Removed from cart',
        description: 'The product was removed from your cart.',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Could not remove item',
        description: 'Please try again.',
      });
    }
  };

  const rwfTotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/shop" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#123B5D] hover:text-[#F28C28] transition-colors">
          <FiArrowLeft aria-hidden="true" /> Continue Shopping
        </Link>

        <h1 className="text-2xl font-extrabold text-[#123B5D] sm:text-3xl mb-6">Your Cart</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center shadow-sm">
            <FiShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-lg font-bold text-[#123B5D]">Your cart is empty</h2>
            <p className="mt-2 text-sm text-gray-500">Browse our collection and add items to get started.</p>
            <Link href="/shop" className="mt-6 inline-block rounded-lg bg-[#F28C28] px-6 py-3 text-sm font-bold text-[#111111] hover:bg-[#123B5D] hover:text-white transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const imageUrl = productService.getPrimaryImageUrl(item.product);
                return (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC]">
                      <Image src={imageUrl} alt={item.product.name} fill unoptimized className="object-contain p-1" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <p className="font-bold text-sm text-[#111111] truncate">{item.product.name}</p>
                        {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                        <p className="mt-1 text-sm font-extrabold text-[#123B5D]">
                          {format(Number(item.product.price))}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white">
                          <button type="button" onClick={() => void updateQuantity(item, -1)} disabled={item.quantity <= 1} aria-label="Decrease" className="flex h-8 w-8 items-center justify-center text-[#123B5D] hover:text-[#F28C28] disabled:text-gray-300">
                            <FiMinus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button type="button" onClick={() => void updateQuantity(item, 1)} disabled={item.quantity >= item.product.stockQuantity} aria-label="Increase" className="flex h-8 w-8 items-center justify-center text-[#123B5D] hover:text-[#F28C28] disabled:text-gray-300">
                            <FiPlus className="h-3 w-3" />
                          </button>
                        </div>
                        <button type="button" onClick={() => void removeItem(item)} aria-label="Remove item" className="text-red-500 hover:text-red-700 transition-colors">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm h-fit">
              <h2 className="text-base font-extrabold text-[#123B5D] mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-2">
                    <span className="text-gray-600 truncate">{item.product.name} × {item.quantity}</span>
                    <span className="font-semibold shrink-0">{format(Number(item.product.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between font-extrabold text-[#123B5D]">
                <span>Total</span>
                <span>{format(rwfTotal)}</span>
              </div>
              <div className="mt-2 rounded-lg bg-[#EEF3F6] px-3 py-2 text-xs text-gray-600">
                Payment is collected in <strong>RWF</strong> via Rwanda Mobile Money (Paypack). The display currency above is for reference only.
              </div>
              <Link href="/checkout" className="mt-4 block w-full rounded-lg bg-[#F28C28] px-6 py-3 text-center text-sm font-extrabold text-[#111111] hover:bg-[#123B5D] hover:text-white transition-colors">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
