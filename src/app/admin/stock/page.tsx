'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

import StockForm from '@/app/components/admin/stock/StockForm';
import { getApiErrorMessage } from '@/app/lib/api-error';
import { productService } from '@/app/services/product.service';
import { stockService } from '@/app/services/stock.service';
import type { Product, StockEntry, StockPage, StockStatus } from '@/app/types';

const statuses: { value: StockStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
  { value: 'overstock', label: 'Overstock' },
];

const emptyPage: StockPage = {
  data: [], totalPages: 1, totalCount: 0,
  summary: { totalProducts: 0, lowStock: 0, outOfStock: 0, overstock: 0 },
};

const statusPresentation: Record<StockStatus, { label: string; className: string }> = {
  out_of_stock: { label: 'Out of stock', className: 'bg-red-100 text-red-800' },
  low: { label: 'Low stock', className: 'bg-amber-100 text-amber-800' },
  normal: { label: 'Normal', className: 'bg-green-100 text-green-800' },
  overstock: { label: 'Overstock', className: 'bg-blue-100 text-blue-800' },
};

async function getAllProducts(): Promise<Product[]> {
  const firstPage = await productService.getAdminProducts({ page: 1, limit: 100 });
  const products = [...firstPage.data];
  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const nextPage = await productService.getAdminProducts({ page, limit: 100 });
    products.push(...nextPage.data);
  }
  return products;
}

export default function AdminStockPage() {
  const [result, setResult] = useState<StockPage>(emptyPage);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StockStatus | ''>('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [productsErrorMessage, setProductsErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingEntry, setEditingEntry] = useState<StockEntry>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchStock = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await stockService.getStock({ page, limit: 10, search: search.trim() || undefined, status: status || undefined });
      setResult(data);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error instanceof Error ? error : new Error('Unable to load stock entries.'), 'Unable to load stock entries.'));
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchStock(); }, 250);
    return () => window.clearTimeout(timeoutId);
  }, [fetchStock]);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((error: Error) => setProductsErrorMessage(getApiErrorMessage(error, 'Unable to load products for stock entry.')))
      .finally(() => setIsProductsLoading(false));
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const handleSaved = () => {
    setIsFormOpen(false);
    setEditingEntry(undefined);
    setSuccessMessage(editingEntry ? 'Stock batch updated successfully.' : 'Stock recorded successfully.');
    void fetchStock();
  };

  const deleteStock = async (entry: StockEntry) => {
    if (!window.confirm(`Delete stock batch ${entry.batchCode}? This will reduce the product's total stock by ${entry.quantity}.`)) return;
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await stockService.deleteStock(entry.id);
      setSuccessMessage(`Stock batch ${entry.batchCode} deleted.`);
      void fetchStock();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error instanceof Error ? error : new Error('Unable to delete this stock entry.'), 'Unable to delete this stock entry.'));
    }
  };

  const statCards = [
    { label: 'Total products', value: result.summary.totalProducts, accent: 'border-[#123B5D]' },
    { label: 'Low stock', value: result.summary.lowStock, accent: 'border-amber-500' },
    { label: 'Out of stock', value: result.summary.outOfStock, accent: 'border-red-500' },
    { label: 'Overstock', value: result.summary.overstock, accent: 'border-blue-500' },
  ];

  return (
    <>
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="mb-2 inline-block rounded-full border border-[#F28C28]/30 bg-[#123B5D]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#123B5D]">Admin Dashboard</p><h1 className="text-2xl font-extrabold text-[#111111] sm:text-3xl">Stock Management</h1><p className="mt-1 text-sm text-gray-500">Track stock receipts, current quantities, and stock health.</p></div>
            <button type="button" disabled={isProductsLoading || products.length === 0} onClick={() => { setEditingEntry(undefined); setIsFormOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-md bg-[#123B5D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#F28C28] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"><FiPlus aria-hidden="true" />Add stock</button>
          </header>

          {successMessage && <div role="status" className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{successMessage}</div>}
          {productsErrorMessage && <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{productsErrorMessage}</div>}
          {errorMessage && <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

          <section aria-label="Stock summary" className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statCards.map((card) => <div key={card.label} className={`rounded-md border border-gray-200 border-l-4 ${card.accent} bg-white px-4 py-4`}><p className="text-xs font-semibold text-gray-500">{card.label}</p><p className="mt-1 text-2xl font-extrabold text-[#111111]">{card.value}</p></div>)}
          </section>

          <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="grid gap-3 border-b border-gray-200 p-4 sm:grid-cols-[minmax(0,1fr)_220px_auto]">
              <label className="sr-only" htmlFor="stock-search">Search products</label>
              <input id="stock-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search products" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#F28C28]" />
              <label className="sr-only" htmlFor="stock-status">Filter by status</label>
              <select id="stock-status" value={status} onChange={(event) => { setStatus(event.target.value as StockStatus | ''); setPage(1); }} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#F28C28]">{statuses.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
              <button type="button" onClick={() => void fetchStock()} disabled={isLoading} aria-label="Refresh stock entries" className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2.5 text-sm font-semibold text-[#123B5D] hover:bg-[#EEF3F6] disabled:opacity-60"><FiRefreshCw aria-hidden="true" />Refresh</button>
            </div>

            {isLoading ? <div className="px-6 py-16 text-center text-sm text-gray-500" role="status">Loading stock entries...</div> : result.data.length === 0 ? <div className="px-6 py-16 text-center text-sm text-gray-500">No stock entries match these filters.</div> : (
              <div className="overflow-x-auto">
                <table className="min-w-[1000px] w-full text-left text-sm">
                  <thead className="bg-[#123B5D] text-white"><tr><th scope="col" className="px-4 py-3">Product</th><th scope="col" className="px-4 py-3">Batch code</th><th scope="col" className="px-4 py-3">Batch quantity</th><th scope="col" className="px-4 py-3">Total stock</th><th scope="col" className="px-4 py-3">Unit cost</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3">Date added</th><th scope="col" className="px-4 py-3">Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">{result.data.map((entry) => {
                    const presentation = statusPresentation[entry.product.stockStatus ?? 'out_of_stock'];
                    return <tr key={entry.id} className="hover:bg-[#EEF3F6]/70">
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-gray-100">{entry.product.images?.[0]?.url && <Image src={entry.product.images[0].url} alt="" fill sizes="44px" unoptimized className="object-cover" />}</div><span className="max-w-48 truncate font-bold">{entry.product.name}</span></div></td>
                      <td className="px-4 py-3 font-mono text-xs">{entry.batchCode}</td>
                      <td className="px-4 py-3">{entry.quantity}</td>
                      <td className="px-4 py-3 font-bold">{entry.product.stockQuantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{entry.unitCost.toLocaleString()} RWF</td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${presentation.className}`}>{presentation.label}</span></td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1"><button type="button" onClick={() => { setEditingEntry(entry); setIsFormOpen(true); }} aria-label={`Edit batch ${entry.batchCode}`} className="rounded-md p-2 text-[#123B5D] hover:bg-[#EEF3F6]"><FiEdit2 /></button><button type="button" onClick={() => void deleteStock(entry)} aria-label={`Delete batch ${entry.batchCode}`} className="rounded-md p-2 text-red-600 hover:bg-red-50"><FiTrash2 /></button></div></td>
                    </tr>;
                  })}</tbody>
                </table>
              </div>
            )}

            {!isLoading && result.totalPages > 1 && <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3"><p className="text-xs text-gray-500">{result.totalCount} entries · Page {page} of {result.totalPages}</p><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40">Previous</button><button type="button" disabled={page >= result.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40">Next</button></div></div>}
          </section>
      {isFormOpen && <StockForm products={products} entry={editingEntry} onClose={() => { setIsFormOpen(false); setEditingEntry(undefined); }} onSuccess={handleSaved} />}
    </>
  );
}