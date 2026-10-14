'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { api } from '@/app/lib/api';
import { useCurrency } from '@/app/components/CurrencyProvider';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  purchasePrice: number;
  size: string | null;
  color: string | null;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingAddr: string;
  items: OrderItem[];
  createdAt: string;
}

interface OrderListResponse {
  success: boolean;
  data: Order[];
  totalPages: number;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  READY: 'bg-indigo-100 text-indigo-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const PAYMENT_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
  REFUNDED: 'bg-blue-100 text-blue-800',
};

export default function OrdersPage() {
  const router = useRouter();
  const { format } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.replace('/auth/login'); return; }

    api.get<OrderListResponse>('/orders/my')
      .then((res) => setOrders(res.data.data))
      .catch(() => setError('Unable to load your orders. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/account" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#123B5D] hover:text-[#F28C28] transition-colors">
          <FiArrowLeft aria-hidden="true" /> Back to Account
        </Link>

        <h1 className="text-2xl font-extrabold text-[#123B5D] sm:text-3xl mb-6">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-sm text-red-700">{error}</div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center shadow-sm">
            <FiPackage className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-lg font-bold text-[#123B5D]">No orders yet</h2>
            <p className="mt-2 text-sm text-gray-500">When you place an order, it will appear here.</p>
            <Link href="/shop" className="mt-6 inline-block rounded-lg bg-[#F28C28] px-6 py-3 text-sm font-bold text-[#111111] hover:bg-[#123B5D] hover:text-white transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="mt-1 text-sm font-bold text-[#111111]">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-RW', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${PAYMENT_STYLES[order.paymentStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-600 truncate max-w-xs">
                    <span className="font-semibold">Ship to:</span> {order.shippingAddr}
                  </p>
                  <p className="text-base font-extrabold text-[#123B5D]">
                    {format(Number(order.totalAmount))}
                    <span className="ml-1 text-xs font-normal text-gray-400">(paid in RWF)</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
