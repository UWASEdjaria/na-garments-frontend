'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiShoppingBag, FiSmartphone } from 'react-icons/fi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { cartService } from '@/app/services/cart.service';
import { api } from '@/app/lib/api';
import { productService } from '@/app/services/product.service';
import { useCurrency } from '@/app/components/CurrencyProvider';
import type { CartItem } from '@/app/types';

type Step = 'review' | 'shipping' | 'payment' | 'done';

interface OrderResponse {
  success: boolean;
  data: { id: string; totalAmount: number };
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data: { paymentId: string; status: string };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { format } = useCurrency();

  const [step, setStep] = useState<Step>('review');
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shippingAddr, setShippingAddr] = useState('');
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [rwfTotal, setRwfTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.replace('/auth/login'); return; }
    setIsLoading(true);
    const cart = await cartService.getCart();
    if (cart.length === 0) { router.replace('/cart'); return; }
    setItems(cart);
    setRwfTotal(cart.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0));
    setIsLoading(false);
  }, [router]);

  useEffect(() => { void loadCart(); }, [loadCart]);

  const handlePlaceOrder = async () => {
    if (!shippingAddr.trim()) { setError('Shipping address is required.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await api.post<OrderResponse>('/orders', { shippingAddr: shippingAddr.trim() });
      setOrderId(res.data.data.id);
      setRwfTotal(Number(res.data.data.totalAmount));
      setStep('payment');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInitiatePayment = async () => {
    if (!phone.trim()) { setError('Phone number is required for Mobile Money.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await api.post<PaymentResponse>('/payments/initiate', {
        orderId,
        amount: rwfTotal,
        paymentMethod: 'MOMO',
        phoneNumber: phone.trim(),
      });
      if (res.data.success) {
        setStep('done');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment initiation failed.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#EEF3F6]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#EEF3F6] border-t-[#F28C28]" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/cart" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#123B5D] hover:text-[#F28C28] transition-colors">
          <FiArrowLeft aria-hidden="true" /> Back to Cart
        </Link>

        <h1 className="text-2xl font-extrabold text-[#123B5D] sm:text-3xl mb-6">Checkout</h1>

        {/* RWF payment notice */}
        <div className="mb-6 rounded-xl bg-[#123B5D] text-white px-5 py-4 text-sm">
          <p className="font-bold">Payment is collected in RWF via Rwanda Mobile Money (Paypack).</p>
          <p className="mt-1 text-[#EEF3F6]/80 text-xs">Any currency shown above is for display only. Your actual charge will be in Rwandan Francs.</p>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Step: Review */}
        {step === 'review' && (
          <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#123B5D]">Order Review</h2>
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const imageUrl = productService.getPrimaryImageUrl(item.product);
                return (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3 py-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC] border border-gray-100">
                      {imageUrl && imageUrl !== '/images/placeholder-garment.jpg' && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt={item.product.name} className="h-full w-full object-contain p-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.product.name}</p>
                      {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                      {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-500">× {item.quantity}</p>
                      <p className="font-bold text-sm text-[#123B5D]">{format(Number(item.product.price) * item.quantity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between font-extrabold text-[#123B5D]">
              <span>Total (RWF)</span>
              <span>{rwfTotal.toLocaleString('en-RW')} RWF</span>
            </div>
            <button
              type="button"
              onClick={() => setStep('shipping')}
              className="w-full rounded-lg bg-[#F28C28] px-6 py-3 text-sm font-extrabold text-[#111111] hover:bg-[#123B5D] hover:text-white transition-colors"
            >
              Continue to Shipping
            </button>
          </div>
        )}

        {/* Step: Shipping */}
        {step === 'shipping' && (
          <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#123B5D]">Shipping Details</h2>
            <label className="block text-sm font-semibold text-gray-700">
              Delivery address
              <textarea
                rows={3}
                value={shippingAddr}
                onChange={(e) => setShippingAddr(e.target.value)}
                placeholder="Street, district, city, Rwanda"
                className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20 resize-none"
              />
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep('review')} className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Back
              </button>
              <button
                type="button"
                onClick={() => void handlePlaceOrder()}
                disabled={isSubmitting || !shippingAddr.trim()}
                className="flex-1 rounded-lg bg-[#F28C28] px-6 py-3 text-sm font-extrabold text-[#111111] hover:bg-[#123B5D] hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing order...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === 'payment' && (
          <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#123B5D]">Mobile Money Payment</h2>
            <div className="rounded-lg bg-[#EEF3F6] px-4 py-3 text-sm">
              <p className="font-bold text-[#123B5D]">Amount due: {rwfTotal.toLocaleString('en-RW')} RWF</p>
              <p className="text-xs text-gray-500 mt-1">You will receive a Mobile Money prompt on your phone. Approve it to complete payment.</p>
            </div>
            <label className="block text-sm font-semibold text-gray-700">
              <span className="flex items-center gap-2"><FiSmartphone className="h-4 w-4" /> Rwanda Mobile Money number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX"
                className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
              />
            </label>
            <button
              type="button"
              onClick={() => void handleInitiatePayment()}
              disabled={isSubmitting || !phone.trim()}
              className="w-full rounded-lg bg-[#F28C28] px-6 py-3 text-sm font-extrabold text-[#111111] hover:bg-[#123B5D] hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiShoppingBag className="h-4 w-4" />
              {isSubmitting ? 'Sending prompt...' : 'Pay with Mobile Money'}
            </button>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div className="rounded-xl bg-white border border-gray-200 p-10 shadow-sm text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">✓</div>
            <h2 className="text-xl font-extrabold text-[#123B5D]">Payment prompt sent!</h2>
            <p className="text-sm text-gray-600">
              Check your phone and approve the Mobile Money prompt to complete your payment.
              Your order will be confirmed once payment is received.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/account/orders" className="rounded-lg bg-[#F28C28] px-6 py-3 text-sm font-extrabold text-[#111111] hover:bg-[#123B5D] hover:text-white transition-colors">
                View My Orders
              </Link>
              <Link href="/shop" className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-[#123B5D] hover:bg-[#EEF3F6] transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
