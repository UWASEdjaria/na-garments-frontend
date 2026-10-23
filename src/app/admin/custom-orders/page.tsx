'use client';


import { useState } from 'react';


import CustomOrderDetailModal from '@/app/components/admin/custom-orders/CustomOrderDetailModal';
import CustomOrderTable from '@/app/components/admin/custom-orders/CustomOrderTable';
import useAdminCustomOrders from '@/app/hooks/useAdminCustomOrders';

export default function AdminCustomOrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const {
    orders,
    isLoading,
    errorMessage,
    fetchOrders,
  } = useAdminCustomOrders();

  return (
    <>
          {/* Header */}
          <section className="mb-6 sm:mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
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
            <CustomOrderTable orders={orders} onView={setSelectedOrderId} />
          )}
          {selectedOrderId && (
            <CustomOrderDetailModal
              orderId={selectedOrderId}
              onClose={() => setSelectedOrderId(null)}
            />
          )}
    </>
  );
}