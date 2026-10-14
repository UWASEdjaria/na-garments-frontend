'use client';

import { useRef, useState, type FormEvent } from 'react';
import { FiX } from 'react-icons/fi';

import { getApiErrorMessage } from '@/app/lib/api-error';
import { productService } from '@/app/services/product.service';
import type { Category, Product, ProductMutationData, ProductOptions, ProductType } from '@/app/types';

interface ProductFormProps {
  categories: Category[];
  options: ProductOptions;
  product?: Product;
  onClose: () => void;
  onSuccess: (product: Product, isNew: boolean) => void;
}

const slugFromName = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function ProductForm({ categories, options, product, onClose, onSuccess }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price.toString() ?? '');
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '');
  const [minimumStockLevel, setMinimumStockLevel] = useState(String(product?.minimumStockLevel ?? 5));
  const [maximumStockLevel, setMaximumStockLevel] = useState(String(product?.maximumStockLevel ?? 100));
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [colors, setColors] = useState<string[]>(product?.colors ?? []);
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
  const [productType, setProductType] = useState<ProductType>(product?.productType ?? 'MADE_TO_ORDER');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? product?.images?.[0]?.url ?? '');
  const [image, setImage] = useState<File>();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInProgress = useRef(false);
  const existingImageUrl = product?.imageUrl ?? product?.images?.[0]?.url ?? '';

  const toggleOption = (list: string[], value: string, setList: (next: string[]) => void) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionInProgress.current) return;
    setErrorMessage('');

    const minimum = Number(minimumStockLevel);
    const maximum = Number(maximumStockLevel);
    const amount = Number(price);
    if (name.trim().length < 3) return setErrorMessage('Product name must be at least 3 characters.');
    if (description.trim().length < 5) return setErrorMessage('Description must be at least 5 characters.');
    if (!Number.isFinite(amount) || amount <= 0) return setErrorMessage('Selling price must be greater than zero.');
    if (!categoryId) return setErrorMessage('Select a product category.');
    if (!Number.isInteger(minimum) || minimum < 0 || !Number.isInteger(maximum) || maximum < 0) {
      return setErrorMessage('Stock thresholds must be whole numbers at or above zero.');
    }
    if (maximum < minimum) return setErrorMessage('Maximum stock threshold must be at least the minimum threshold.');
    if (imageUrl.trim()) {
      try {
        const url = new URL(imageUrl.trim());
        if (!['http:', 'https:'].includes(url.protocol)) return setErrorMessage('Image URL must use HTTP or HTTPS.');
      } catch {
        return setErrorMessage('Enter a valid image URL.');
      }
    }
    if (image && (!image.type.startsWith('image/') || image.size > 5 * 1024 * 1024)) {
      return setErrorMessage('Choose an image under 5 MB.');
    }

    const data: ProductMutationData = {
      name: name.trim(),
      slug: slugFromName(name),
      description: description.trim(),
      price: amount,
      categoryId,
      minimumStockLevel: minimum,
      maximumStockLevel: maximum,
      sizes,
      colors,
      isAvailable,
      productType,
      ...(imageUrl.trim() && imageUrl.trim() !== existingImageUrl && { imageUrl: imageUrl.trim() }),
      ...(image && { image }),
    };

    submissionInProgress.current = true;
    setIsSubmitting(true);
    try {
      const saved = product
        ? await productService.updateProduct(product.id, data)
        : await productService.createProduct(data);
      onSuccess(saved, !product);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error instanceof Error ? error : new Error('Unable to save this product.'), 'Unable to save this product.'));
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20';
  const checkboxClass = 'flex items-center gap-2 text-sm text-gray-700';

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 backdrop-blur-xl sm:items-center sm:p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="product-form-title" className="max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-white shadow-2xl sm:rounded-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F28C28]">Product catalogue</p>
            <h2 id="product-form-title" className="mt-1 text-xl font-extrabold text-[#123B5D]">{product ? 'Edit product' : 'Add new product'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close product form" className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-[#123B5D]"><FiX className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7" noValidate>
          {errorMessage && <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-gray-700">Product name
              <input required minLength={3} value={name} onChange={(event) => setName(event.target.value)} className={`${inputClass} mt-1.5`} />
            </label>
            <label className="text-sm font-semibold text-gray-700">Category
              <select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className={`${inputClass} mt-1.5`}>
                <option value="">Select a category</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
          </div>
          <label className="block text-sm font-semibold text-gray-700">Description
            <textarea required minLength={5} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className={`${inputClass} mt-1.5 resize-y`} />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold text-gray-700">Selling price
              <input required type="number" min="0.01" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className={`${inputClass} mt-1.5`} />
            </label>
            <label className="text-sm font-semibold text-gray-700">Minimum stock
              <input required type="number" min="0" step="1" value={minimumStockLevel} onChange={(event) => setMinimumStockLevel(event.target.value)} className={`${inputClass} mt-1.5`} />
            </label>
            <label className="text-sm font-semibold text-gray-700">Maximum stock
              <input required type="number" min="0" step="1" value={maximumStockLevel} onChange={(event) => setMaximumStockLevel(event.target.value)} className={`${inputClass} mt-1.5`} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset className="min-w-0"><legend className="mb-2 text-sm font-semibold text-gray-700">Available sizes</legend><div className="flex flex-wrap gap-x-4 gap-y-2">{options.sizes.map((size) => <label key={size} className={checkboxClass}><input type="checkbox" checked={sizes.includes(size)} onChange={() => toggleOption(sizes, size, setSizes)} className="accent-[#123B5D]" />{size}</label>)}</div></fieldset>
            <fieldset className="min-w-0"><legend className="mb-2 text-sm font-semibold text-gray-700">Available colors</legend><div className="flex flex-wrap gap-x-4 gap-y-2">{options.colors.map((color) => <label key={color} className={checkboxClass}><input type="checkbox" checked={colors.includes(color)} onChange={() => toggleOption(colors, color, setColors)} className="accent-[#123B5D]" />{color}</label>)}</div></fieldset>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-gray-700">Product image</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-gray-500">Upload image
                <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0])} className={`${inputClass} mt-1.5 file:mr-3 file:rounded-sm file:border-0 file:bg-[#EEF3F6] file:px-2 file:py-1 file:text-xs file:font-semibold`} />
              </label>
              <label className="text-xs font-medium text-gray-500">Or image URL
                <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className={`${inputClass} mt-1.5`} placeholder="https://..." />
              </label>
            </div>
          </fieldset>
          <label className="text-sm font-semibold text-gray-700">Product type
              <select required value={productType} onChange={(event) => setProductType(event.target.value as ProductType)} className={`${inputClass} mt-1.5`}>
                <option value="READY_TO_WEAR">Ready to Wear</option>
                <option value="MADE_TO_ORDER">Made to Order</option>
              </select>
            </label>
          <label className={checkboxClass}><input type="checkbox" checked={isAvailable} onChange={(event) => setIsAvailable(event.target.checked)} className="accent-[#123B5D]" />Available for purchase</label>
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-[#123B5D] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#F28C28] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Saving...' : product ? 'Save changes' : 'Create product'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}