'use client';

import { useRef, useState, type FormEvent } from 'react';
import { FiX } from 'react-icons/fi';

import { getApiErrorMessage } from '@/app/lib/api-error';
import { productService } from '@/app/services/product.service';
import type { Category, CategoryMutationData } from '@/app/types';

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
  onSuccess: (category: Category, isNew: boolean) => void;
}

export default function CategoryForm({ category, onClose, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInProgress = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionInProgress.current) return;
    setErrorMessage('');
    if (name.trim().length < 2) return setErrorMessage('Category name must be at least 2 characters.');
    if (imageUrl.trim()) {
      try {
        const url = new URL(imageUrl.trim());
        if (!['http:', 'https:'].includes(url.protocol)) return setErrorMessage('Image URL must use HTTP or HTTPS.');
      } catch {
        return setErrorMessage('Enter a valid image URL.');
      }
    }

    const data: CategoryMutationData = {
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
    };
    submissionInProgress.current = true;
    setIsSubmitting(true);
    try {
      const saved = category
        ? await productService.updateCategory(category.id, data)
        : await productService.createCategory(data);
      onSuccess(saved, !category);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error instanceof Error ? error : new Error('Unable to save category.'), 'Unable to save category.'));
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20';

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 backdrop-blur-xl sm:items-center sm:p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="category-form-title" className="w-full max-w-xl rounded-t-xl bg-white shadow-2xl sm:rounded-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-7">
          <div><p className="text-[10px] font-bold uppercase tracking-widest text-[#F28C28]">Product catalogue</p><h2 id="category-form-title" className="mt-1 text-xl font-extrabold text-[#123B5D]">{category ? 'Edit category' : 'Add category'}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close category form" className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-[#123B5D]"><FiX className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-7" noValidate>
          {errorMessage && <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}
          <label className="block text-sm font-semibold text-gray-700">Category name
            <input required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-semibold text-gray-700">Description <span className="font-normal text-gray-500">(optional)</span>
            <textarea maxLength={500} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className={`${inputClass} resize-y`} />
          </label>
          <label className="block text-sm font-semibold text-gray-700">Image URL <span className="font-normal text-gray-500">(optional)</span>
            <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className={inputClass} placeholder="https://..." />
          </label>
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-[#123B5D] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#F28C28] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Saving...' : category ? 'Save changes' : 'Create category'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}