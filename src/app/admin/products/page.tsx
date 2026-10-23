'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

import ProductForm from '@/app/components/admin/products/ProductForm';
import { getApiErrorMessage } from '@/app/lib/api-error';
import { productService } from '@/app/services/product.service';
import type { Category, Product, ProductOptions } from '@/app/types';

import ConfirmDeleteModal from '@/app/components/admin/ConfirmDeleteModal';

const emptyOptions: ProductOptions = { sizes: [], colors: [], productTypes: [] };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [options, setOptions] = useState<ProductOptions>(emptyOptions);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [setupErrorMessage, setSetupErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [toastError, setToastError] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await productService.getAdminProducts({ search: search.trim() || undefined, page, limit: 10 });
      setProducts(result.data);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error instanceof Error ? error : new Error('Unable to load products.'), 'Unable to load products.'));
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    productService.getCategories().then(setCategories).catch((error: Error) => setSetupErrorMessage(getApiErrorMessage(error, 'Unable to load categories.')));
    productService.getOptions().then(setOptions).catch((error: Error) => setSetupErrorMessage(getApiErrorMessage(error, 'Unable to load product options.')));
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchProducts(); }, 250);
    return () => window.clearTimeout(timeoutId);
  }, [fetchProducts]);

  useEffect(() => {
    if (!successMessage && !toastError) return;
    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('');
      setToastError('');
    }, 4000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage, toastError]);

  const handleSaved = (savedProduct: Product, isNew: boolean) => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
    setSuccessMessage(isNew ? 'Product created successfully.' : 'Product updated successfully.');
    if (isNew) {
      setPage(1);
      void productService.getAdminProducts({ search: search.trim() || undefined, page: 1, limit: 10 })
        .then((result) => setProducts(result.data))
        .catch((error: Error) => setErrorMessage(getApiErrorMessage(error, 'Product was saved, but the list could not be refreshed.')));
    } else {
      setProducts((current) => current.map((item) => item.id === savedProduct.id ? savedProduct : item));
    }
  };

  const toggleAvailability = async (product: Product) => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const updated = await productService.toggleAvailability(product.id);
      setProducts((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSuccessMessage(`Availability updated for ${updated.name}.`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error instanceof Error ? error : new Error('Unable to update product availability.'), 'Unable to update product availability.'));
    }
  };

  const deleteProduct = async () => {
    if (!productToDelete || isDeleting) return;

    const product = productToDelete;
    setIsDeleting(true);
    setToastError('');
    setSuccessMessage('');

    try {
      await productService.deleteProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setProductToDelete(null);
      setSuccessMessage(`${product.name} deleted successfully.`);
    } catch (error) {
      setProductToDelete(null);
      setToastError(getApiErrorMessage(
        error instanceof Error ? error : new Error('Unable to delete this product.'),
        'Unable to delete this product.'
      ));
    } finally {
      setIsDeleting(false);
    }
  };

  const statusLabel = (status?: Product['stockStatus']) => ({
    out_of_stock: 'Out of stock', low: 'Low stock', normal: 'Normal', overstock: 'Overstock',
  })[status ?? 'out_of_stock'];

  return (
    <>
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                
                <h1 className="text-2xl font-extrabold text-[#111111] sm:text-3xl">Products</h1>
                <p className="mt-1 text-sm text-gray-500">Manage catalogue details and stock thresholds.</p>
              </div>
               <button
                 type="button"
                 onClick={() => {
                 setEditingProduct(undefined);
                 setIsFormOpen(true);
                 }}
                 className="inline-flex items-center justify-center gap-2 rounded-md bg-[#123B5D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#F28C28] hover:text-[#111111]"
               >
                 <FiPlus aria-hidden="true" />
                    Add product
                </button>
            </header>

            {setupErrorMessage && <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{setupErrorMessage}</div>}
            {errorMessage && <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

            {(successMessage || toastError) && (
              <div className={`fixed right-4 top-4 z-[100] flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-xl ${
                toastError ? 'border-red-200 bg-white text-red-700' : 'border-green-200 bg-white text-green-800'
              }`} role={toastError ? 'alert' : 'status'}>
                <span className="flex-1 text-sm font-medium">{toastError || successMessage}</span>
                <button type="button" onClick={() => { setSuccessMessage(''); setToastError(''); }} aria-label="Dismiss notification" className="text-lg leading-5 text-gray-500 hover:text-gray-900">&times;</button>
              </div>
            )}

            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="sr-only" htmlFor="product-search">Search products</label>
                <input id="product-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search by name or description" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#F28C28] sm:max-w-sm" />
                <button type="button" onClick={() => void fetchProducts()} disabled={isLoading} aria-label="Refresh products" className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2.5 text-sm font-semibold text-[#123B5D] hover:bg-[#EEF3F6] disabled:opacity-60"><FiRefreshCw aria-hidden="true" />Refresh</button>
              </div>

              {isLoading ? <div className="px-6 py-16 text-center text-sm text-gray-500" role="status">Loading products...</div> : products.length === 0 ? <div className="px-6 py-16 text-center text-sm text-gray-500">No products found.</div> : (
                <div className="overflow-x-auto">
                  <table className="min-w-[900px] w-full text-left text-sm">
                    <thead className="bg-[#123B5D] text-white"><tr><th scope="col" className="px-4 py-3">Product</th><th scope="col" className="px-4 py-3">Type</th><th scope="col" className="px-4 py-3">Category</th><th scope="col" className="px-4 py-3">Price</th><th scope="col" className="px-4 py-3">Stock</th><th scope="col" className="px-4 py-3">Availability</th><th scope="col" className="px-4 py-3">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => <tr key={product.id} className="hover:bg-[#EEF3F6]/70">
                        <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">{product.images?.[0]?.url && <Image src={product.images[0].url} alt="" fill sizes="48px" unoptimized className="object-cover" />}</div><div className="min-w-0"><p className="max-w-64 truncate font-bold text-[#111111]">{product.name}</p><p className="max-w-64 truncate text-xs text-gray-500">{product.slug}</p></div></div></td>
                        <td className="px-4 py-3">
                         <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                             product.productType === 'MADE_TO_ORDER'
                             ? 'bg-[#FFF0DF] text-[#9A4D00]'
                             : 'bg-[#DBEAFE] text-[#123B5D]'
                             }`}>
                           {product.productType === 'MADE_TO_ORDER' ? 'Made to Order' : 'Ready to Wear'}
                          </span>
                        </td>
                            <td className="px-4 py-3 text-gray-700">{product.category?.name ?? categories.find((category) => category.id === product.categoryId)?.name ?? '-'}</td>
                            <td className="whitespace-nowrap px-4 py-3">{product.price == null ? 'Price on request' : `${product.price.toLocaleString()} RWF`}</td>

                            <td className="px-4 py-3"><span className="font-semibold">{product.stockQuantity}</span><span className="block text-xs text-gray-500">{statusLabel(product.stockStatus)}</span></td>
                            <td className="px-4 py-3"><button type="button" onClick={() => void toggleAvailability(product)} className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{product.isAvailable ? 'Available' : 'Unavailable'}</button></td>
                            <td className="px-4 py-3">
                       <div className="flex items-center gap-1">
                             <button
                              type="button"
                                onClick={() => {
                                  setEditingProduct(product);
                                   setIsFormOpen(true);
                                    }}
                                     aria-label={`Edit ${product.name}`}
                                     className="rounded-md p-2 text-[#123B5D] hover:bg-[#EEF3F6]"
                                      >
                                     <FiEdit2 />
                                   </button>

                                  <button
                                       type="button"
                                          onClick={() => setProductToDelete(product)}
                                            aria-label={`Delete ${product.name}`}
                                              className="rounded-md p-2 text-red-600 hover:bg-red-50"
                                               >
                                      <FiTrash2 />
                                  </button>
                               </div>

                         </td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              )}

              {!isLoading && totalPages > 1 && <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3"><p className="text-xs text-gray-500">Page {page} of {totalPages}</p><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40">Previous</button><button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40">Next</button></div></div>}
            </section>
            {productToDelete && (
                 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
                 <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-2xl">
                  <ConfirmDeleteModal
                    itemName={productToDelete.name}
                    isDeleting={isDeleting}
                    onCancel={() => setProductToDelete(null)}
                    onConfirm={() => void deleteProduct()}
                    />
              </div>
           </div>
           )}
            
      {isFormOpen && <ProductForm categories={categories} options={options} product={editingProduct} onClose={() => { setIsFormOpen(false); setEditingProduct(undefined); }} onSuccess={handleSaved} />}
    </>
  );
}

