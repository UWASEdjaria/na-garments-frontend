'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

import { getApiErrorMessage } from '@/app/lib/api-error';
import { adminCustomOrderService } from '@/app/services/adminCustomOrder.service';
import type { AdminCustomOrder } from '@/app/types/admin-custom-order';

interface CustomOrderDetailModalProps {
  orderId: string;
  onClose: () => void;
}

export default function CustomOrderDetailModal({ orderId, onClose }: CustomOrderDetailModalProps) {
  const [order, setOrder] = useState<AdminCustomOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrentRequest = true;

    adminCustomOrderService.getById(orderId)
      .then((data) => {
        if (isCurrentRequest) setOrder(data);
      })
      .catch((error: Error) => {
        if (isCurrentRequest) {
          setErrorMessage(getApiErrorMessage(error, 'Unable to load this custom order.'));
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [orderId]);

  const detailRows = order ? [
    { label: 'Garment type', value: order.garmentType },
    { label: 'Quantity', value: String(order.quantity) },
    { label: 'Order status', value: order.status.replaceAll('_', ' ') },
    { label: 'Payment status', value: order.paymentStatus.replaceAll('_', ' ') },
    { label: 'Submitted', value: new Date(order.createdAt).toLocaleString() },
  ] : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-0 backdrop-blur-xl sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close custom order details"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-order-detail-title"
        className="relative z-10 max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-t-xl bg-white shadow-2xl sm:rounded-xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div>
<p className="text-[10px] font-bold uppercase tracking-widest text-[#F28C28]">Admin Dashboard</p>
            <h2 id="custom-order-detail-title" className="mt-1 text-xl font-extrabold text-[#123B5D]">Custom order details</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close custom order details"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-[#123B5D]"
          >
            <FiX className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-5 sm:p-7">
          {isLoading && <p role="status" className="py-12 text-center text-sm text-gray-500">Loading custom order...</p>}
          {errorMessage && <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

          {order && (
            <>
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#123B5D]">Customer</h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div><dt className="text-xs font-semibold text-gray-500">Name</dt><dd className="mt-1 break-words text-sm font-medium text-[#111111]">{order.name}</dd></div>
                  <div><dt className="text-xs font-semibold text-gray-500">Email</dt><dd className="mt-1 break-all text-sm font-medium text-[#111111]">{order.email}</dd></div>
                  <div><dt className="text-xs font-semibold text-gray-500">Phone</dt><dd className="mt-1 break-words text-sm font-medium text-[#111111]">{order.phone}</dd></div>
                </dl>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#123B5D]">Order</h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  {detailRows.map((row) => <div key={row.label}><dt className="text-xs font-semibold text-gray-500">{row.label}</dt><dd className="mt-1 break-words text-sm font-medium capitalize text-[#111111]">{row.value}</dd></div>)}
                </dl>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#123B5D]">Description</h3>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">{order.description}</p>
              </section>

              {order.measurements && <section><h3 className="text-sm font-bold uppercase tracking-wide text-[#123B5D]">Measurements</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">{order.measurements}</p></section>}
              {order.additionalReqs && <section><h3 className="text-sm font-bold uppercase tracking-wide text-[#123B5D]">Additional requirements</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">{order.additionalReqs}</p></section>}
              {order.adminNotes && <section><h3 className="text-sm font-bold uppercase tracking-wide text-[#123B5D]">Admin notes</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">{order.adminNotes}</p></section>}

              {order.referenceImageUrls.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#123B5D]">Reference images</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {order.referenceImageUrls.map((url, index) => (
                      <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer" className="relative aspect-square overflow-hidden rounded-md border border-gray-200 bg-[#EEF3F6]">
                        <Image src={url} alt={`Reference image ${index + 1}`} fill sizes="(max-width: 640px) 50vw, 33vw" unoptimized className="object-cover" />
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          <div className="border-t border-gray-100 pt-4 text-right">
            <button type="button" onClick={onClose} className="rounded-md bg-[#123B5D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#F28C28] hover:text-[#111111]">Close</button>
          </div>
        </div>
      </section>
    </div>
  );
}