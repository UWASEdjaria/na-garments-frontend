'use client';

import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

import Navbar from '@/app/components/Navbar';
import CustomOrderTable from '@/app/components/admin/custom-orders/CustomOrderTable';
import useAdminCustomOrders from '@/app/hooks/useAdminCustomOrders';

export default function AdminCustomOrdersPage() {
  const {
    orders,
    isLoading,
    errorMessage,
    fetchOrders,
  } = useAdminCustomOrders();

  return (
    <div className="min-h-screen w-full bg-[#EEF3F6] text-[#111111] antialiased">
      <Navbar />

      <main className="w-full px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <section className="mb-6 sm:mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Link
                  href="/"
                  className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-[#123B5D] transition-colors hover:text-[#F28C28] sm:text-sm"
                >
                  <FiArrowLeft />
                  Back to Home
                </Link>

                <span className="mb-2 inline-block rounded-full border border-[#F28C28]/30 bg-[#123B5D]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#123B5D] sm:text-xs">
                  Admin Dashboard
                </span>

                <h1 className="text-2xl font-extrabold tracking-tight text-[#111111] sm:text-3xl lg:text-4xl">
                  Custom Orders
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-500 sm:text-sm">
                  Manage customer custom order requests and review their
                  submitted details.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchOrders}
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#123B5D] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#F28C28] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm"
              >
                
                Refresh
              </button>
            </div>
          </section>

          {/* Error */}
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 shadow-sm">
              {errorMessage}
            </div>
          )}

          {/* Content */}
          {isLoading ? (
            <div className="rounded-xl border border-gray-200/80 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#EEF3F6] border-t-[#F28C28]" />

              <p className="text-sm font-medium text-gray-500">
                Loading custom orders...
              </p>
            </div>
          ) : (
            <CustomOrderTable orders={orders} />
          )}
        </div>
      </main>
    </div>
  );
}