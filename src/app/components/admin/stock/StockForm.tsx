'use client';

import { useRef, useState, type FormEvent } from 'react';
import { FiX } from 'react-icons/fi';

import { getApiErrorMessage } from '@/app/lib/api-error';
import { stockService } from '@/app/services/stock.service';
import type { Product, StockEntry, StockMutationData } from '@/app/types';

interface StockFormProps {
  products: Product[];
  entry?: StockEntry;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StockForm({ products, entry, onClose, onSuccess }: StockFormProps) {
  const [productId, setProductId] = useState(entry?.productId ?? '');
  const [quantity, setQuantity] = useState(String(entry?.quantity ?? ''));
  const [unitCost, setUnitCost] = useState(String(entry?.unitCost ?? ''));
  const [batchCode, setBatchCode] = useState(entry?.batchCode ?? '');
  const [supplierNote, setSupplierNote] = useState(entry?.supplierNote ?? '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInProgress = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionInProgress.current) return;
    setErrorMessage('');
    const quantityValue = Number(quantity);
    const unitCostValue = Number(unitCost);
    if (!entry && !productId) return setErrorMessage('Select a product.');
    if (!Number.isInteger(quantityValue) || quantityValue <= 0) return setErrorMessage('Quantity must be a whole number greater than zero.');
    if (!Number.isFinite(unitCostValue) || unitCostValue <= 0) return setErrorMessage('Unit cost must be greater than zero.');
    if (batchCode.trim().length > 60) return setErrorMessage('Batch code must be 60 characters or fewer.');
    if (supplierNote.trim().length > 500) return setErrorMessage('Supplier note must be 500 characters or fewer.');

    const data: StockMutationData = {
      ...(!entry && { productId }),
      ...(batchCode.trim() && { batchCode: batchCode.trim() }),
      quantity: quantityValue,
      unitCost: unitCostValue,
      ...(supplierNote.trim() && { supplierNote: supplierNote.trim() }),
    };
    submissionInProgress.current = true;
    setIsSubmitting(true);
    try {
      if (entry) await stockService.updateStock(entry.id, data);
      else await stockService.addStock(data);
      onSuccess();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error instanceof Error ? error : new Error('Unable to save this stock entry.'), 'Unable to save this stock entry.'));
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20';

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 backdrop-blur-xl sm:items-center sm:p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="stock-form-title" className="max-h-[94dvh] w-full max-w-xl overflow-y-auto rounded-t-xl bg-white shadow-2xl sm:rounded-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-7">
          <div><p className="text-[10px] font-bold uppercase tracking-widest text-[#F28C28]">Inventory</p><h2 id="stock-form-title" className="mt-1 text-xl font-extrabold text-[#123B5D]">{entry ? 'Edit stock batch' : 'Add new stock'}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close stock form" className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-[#123B5D]"><FiX className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-7" noValidate>
          {errorMessage && <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}
          <label className="block text-sm font-semibold text-gray-700">Product
            <select required disabled={Boolean(entry)} value={productId} onChange={(event) => setProductId(event.target.value)} className={inputClass}>
              <option value="">Select a product</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-gray-700">Quantity received
              <input required type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm font-semibold text-gray-700">Unit cost (RWF)
              <input required type="number" min="0.01" step="0.01" value={unitCost} onChange={(event) => setUnitCost(event.target.value)} className={inputClass} />
            </label>
          </div>
          <label className="block text-sm font-semibold text-gray-700">Batch code <span className="font-normal text-gray-500">(optional)</span>
            <input maxLength={60} value={batchCode} onChange={(event) => setBatchCode(event.target.value)} placeholder="Generated automatically if blank" className={inputClass} />
          </label>
          <label className="block text-sm font-semibold text-gray-700">Supplier note <span className="font-normal text-gray-500">(optional)</span>
            <textarea maxLength={500} rows={3} value={supplierNote} onChange={(event) => setSupplierNote(event.target.value)} className={`${inputClass} resize-y`} />
          </label>
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">Cancel</button>
            <button type="submit" disabled={isSubmitting || (!entry && products.length === 0)} className="rounded-md bg-[#123B5D] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#F28C28] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Saving...' : entry ? 'Save batch' : 'Record stock'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}