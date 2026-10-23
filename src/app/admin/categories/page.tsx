'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

import CategoryForm from '@/app/components/admin/categories/CategoryForm';
import ConfirmDeleteModal from '@/app/components/admin/ConfirmDeleteModal';
import { getApiErrorMessage } from '@/app/lib/api-error';
import { productService } from '@/app/services/product.service';
import type { Category } from '@/app/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      setCategories(
        await productService.getCategories(search.trim() || undefined)
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error instanceof Error
            ? error
            : new Error('Unable to load categories.'),
          'Unable to load categories.'
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCategories();
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [fetchCategories]);

  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('');
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const handleSaved = (category: Category, isNew: boolean) => {
    setIsFormOpen(false);
    setEditingCategory(undefined);

    setSuccessMessage(
      isNew
        ? 'Category created successfully.'
        : 'Category updated successfully.'
    );

    setCategories((current) =>
      isNew
        ? [category, ...current]
        : current.map((item) =>
            item.id === category.id ? category : item
          )
    );
  };

  const deleteCategory = async () => {
    if (!categoryToDelete || isDeleting) return;

    const category = categoryToDelete;

    setIsDeleting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await productService.deleteCategory(category.id);

      setCategories((current) =>
        current.filter((item) => item.id !== category.id)
      );

      setCategoryToDelete(null);
      setSuccessMessage(`${category.name} deleted successfully.`);
    } catch (error) {
      setCategoryToDelete(null);

      setErrorMessage(
        getApiErrorMessage(
          error instanceof Error
            ? error
            : new Error('Unable to delete category.'),
          'Unable to delete category.'
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>

          <h1 className="text-2xl font-extrabold text-[#111111] sm:text-3xl">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Organize garments into the categories customers browse.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCategory(undefined);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#123B5D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#F28C28] hover:text-[#111111]"
        >
          <FiPlus aria-hidden="true" />
          Add category
        </button>
      </header>

      {successMessage && (
        <div
          role="status"
          className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="sr-only" htmlFor="category-search">
            Search categories
          </label>

          <input
            id="category-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#F28C28] sm:max-w-sm"
          />

          <button
            type="button"
            onClick={() => void fetchCategories()}
            disabled={isLoading}
            aria-label="Refresh categories"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2.5 text-sm font-semibold text-[#123B5D] hover:bg-[#EEF3F6] disabled:opacity-60"
          >
            <FiRefreshCw aria-hidden="true" />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div
            className="px-6 py-16 text-center text-sm text-gray-500"
            role="status"
          >
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-gray-500">
            No categories found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[650px] w-full text-left text-sm">
              <thead className="bg-[#123B5D] text-white">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Slug
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-[#EEF3F6]/70"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                          {category.imageUrl && (
                            <Image
                              src={category.imageUrl}
                              alt=""
                              fill
                              sizes="40px"
                              unoptimized
                              className="object-cover"
                            />
                          )}
                        </div>

                        <span className="font-bold">{category.name}</span>
                      </div>
                    </td>

                    <td className="max-w-72 truncate px-4 py-3 text-gray-600">
                      {category.description || '—'}
                    </td>

                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {category.slug}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(category);
                            setIsFormOpen(true);
                          }}
                          aria-label={`Edit ${category.name}`}
                          className="rounded-md p-2 text-[#123B5D] hover:bg-[#EEF3F6]"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(category)}
                          aria-label={`Delete ${category.name}`}
                          className="rounded-md p-2 text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {categoryToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
            <ConfirmDeleteModal
              itemName={categoryToDelete.name}
              isDeleting={isDeleting}
              onCancel={() => setCategoryToDelete(null)}
              onConfirm={() => void deleteCategory()}
            />
          </div>
        </div>
      )}

      {isFormOpen && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCategory(undefined);
          }}
          onSuccess={handleSaved}
        />
      )}
    </>
  );
}
