'use client';

import { useState, useEffect, useMemo, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Product, Category } from '@/app/types';
import { productService } from '@/app/services/product.service';
import { cartService } from '@/app/services/cart.service';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

const ITEMS_PER_PAGE = 12; // 12 items work seamlessly across 1, 2, 3, and 4 column grid layouts

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch shop inventory.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (product: Product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter((product: Product) => product.categoryId === selectedCategory);
    }

    list.sort((a: Product, b: Product) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handleAddToCart = async (product: Product) => {
    await cartService.addToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  return (
    <div className="min-h-screen w-full min-w-0 flex flex-col bg-[#EEF3F6] text-[#111111] antialiased selection:bg-[#F28C28] selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="flex-grow w-full min-w-0 pb-12 sm:pb-16 lg:pb-24">
        {/* Banner Section */}
        <section className="bg-[#123B5D] text-white py-8 sm:py-14 px-3 sm:px-6 lg:px-8 border-b-4 border-[#F28C28] shadow-md">
          <div className="max-w-7xl w-full min-w-0 mx-auto text-center space-y-2.5">
            <span className="inline-block max-w-full break-words text-[10px] sm:text-xs font-bold text-[#F28C28] uppercase tracking-widest bg-[#123B5D]/60 px-3 py-1 rounded-full border border-[#F28C28]/30">
              Bespoke & Ready-To-Wear
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight break-words">
              Our Collection
            </h1>
            <p className="text-xs sm:text-sm text-[#EEF3F6]/90 max-w-xl mx-auto leading-relaxed break-words">
              Explore precision-cut menswear, institutional apparel, and master-tailored garments handcrafted in Kigali.
            </p>
          </div>
        </section>

        {/* Search, Filter & Controls Header */}
        <section className="max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-8 lg:pt-10">
          <div className="bg-white p-3 sm:p-5 rounded-xl border border-gray-200/80 shadow-sm space-y-4 min-w-0">
            
            {/* Top Bar: Search Input & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 min-w-0 w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search garments by name or description..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full min-w-0 bg-[#EEF3F6] text-[#111111] placeholder-gray-500 text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#123B5D] focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-[#111111] font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-col min-[400px]:flex-row items-stretch min-[400px]:items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-1 sm:pt-0 w-full sm:w-auto">
                <label htmlFor="sort" className="text-xs font-bold text-[#123B5D] uppercase tracking-wider shrink-0">
                  Sort By:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full min-[400px]:w-auto min-w-0 bg-[#EEF3F6] text-[#111111] border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#123B5D] cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Category Pills Bar */}
            <div className="flex items-center gap-2 min-w-0 overflow-x-auto overscroll-x-contain pb-1 pt-2 border-t border-gray-100 no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-all shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#123B5D] text-white shadow-sm'
                    : 'bg-[#EEF3F6] text-[#111111] hover:bg-gray-200/80'
                }`}
              >
                All Garments
              </button>

              {categories.map((category: Category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-lg transition-all shrink-0 ${
                    selectedCategory === category.id
                      ? 'bg-[#123B5D] text-white shadow-sm'
                      : 'bg-[#EEF3F6] text-[#111111] hover:bg-gray-200/80'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid Area */}
        <section className="max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-8">
          
          {/* Loading Skeleton Grid */}
          {isLoading && (
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {Array.from({ length: 8 }).map((_, index: number) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200/80 p-3 sm:p-4 animate-pulse space-y-4 min-w-0">
                  <div className="h-48 sm:h-52 bg-gray-200 rounded-lg w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded-lg w-full pt-2" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="bg-white border-2 border-red-100 p-6 sm:p-10 lg:p-12 rounded-xl text-center max-w-md w-full min-w-0 mx-auto space-y-4 shadow-sm my-6 sm:my-8">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-xl font-bold">
                !
              </div>
              <h3 className="font-bold text-base sm:text-lg text-[#111111] break-words">Unable to load products</h3>
              <p className="text-xs text-gray-500 leading-relaxed break-words">{error}</p>
              <button
                onClick={loadData}
                className="w-full sm:w-auto bg-[#123B5D] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-[#F28C28] hover:text-[#111111] transition-colors shadow-sm"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="bg-white border border-gray-200/80 p-6 sm:p-12 lg:p-16 rounded-xl text-center max-w-md w-full min-w-0 mx-auto space-y-4 shadow-sm my-6 sm:my-8">
              <div className="w-12 h-12 rounded-full bg-[#EEF3F6] text-[#123B5D] flex items-center justify-center mx-auto text-lg font-bold">
                🔍
              </div>
              <h3 className="font-bold text-base sm:text-lg text-[#123B5D] break-words">No garments found</h3>
              <p className="text-xs text-gray-500 leading-relaxed break-words">
                We couldn&apos;t find any items matching your current filters or search query.
              </p>
              <button
                onClick={handleClearFilters}
                className="w-full sm:w-auto bg-[#F28C28] text-[#111111] hover:bg-[#123B5D] hover:text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
                {paginatedProducts.map((product: Product) => {
                  const imageUrl = productService.getPrimaryImageUrl(product);
                  const isOutOfStock = !product.isAvailable || product.stockQuantity <= 0;
                  const formattedPrice = Number(product.price).toLocaleString();

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-[#123B5D]/30 transition-all duration-200 flex flex-col group min-w-0"
                    >
                      {/* Image Preview Container */}
                      <div className="relative aspect-[4/3] min-h-40 sm:min-h-48 w-full bg-[#EEF3F6] overflow-hidden flex items-center justify-center border-b border-gray-100">
                        {imageUrl && imageUrl !== '/images/placeholder-garment.jpg' ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                            <svg className="w-10 h-10 mb-1 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[10px] font-medium tracking-wide uppercase">NA-Garments</span>
                          </div>
                        )}

                        {/* Stock Badge */}
                        <span
                            className={`absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] font-extrabold uppercase px-2 sm:px-2.5 py-1 rounded-md shadow-sm ${
                            isOutOfStock
                              ? 'bg-red-600 text-white'
                              : 'bg-[#F28C28] text-[#111111]'
                          }`}
                        >
                          {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-3 sm:p-5 flex-grow flex flex-col justify-between space-y-4 min-w-0">
                        <div className="space-y-2 min-w-0">
                          {product.category?.name && (
                            <span className="text-[10px] font-extrabold text-[#123B5D] uppercase tracking-wider block [overflow-wrap:anywhere]">
                              {product.category.name}
                            </span>
                          )}

                          <h2 className="font-bold text-sm sm:text-base text-[#111111] line-clamp-2 [overflow-wrap:anywhere] group-hover:text-[#F28C28] transition-colors">
                            {product.name}
                          </h2>

                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[2.25rem] [overflow-wrap:anywhere]">
                            {product.description || 'Custom tailored garment crafted with premium materials.'}
                          </p>

                          {/* Sizes */}
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="pt-1 flex items-center gap-1.5 flex-wrap min-w-0">
                              <span className="text-[10px] text-gray-400 font-bold uppercase">Sizes:</span>
                              {product.sizes.slice(0, 4).map((size: string) => (
                                <span
                                  key={size}
                                  className="max-w-full text-[10px] font-bold bg-[#EEF3F6] text-[#123B5D] px-1.5 py-0.5 rounded border border-gray-200/60 [overflow-wrap:anywhere]"
                                >
                                  {size}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Colors */}
                          {product.colors && product.colors.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                              <span className="text-[10px] text-gray-400 font-bold uppercase">Colors:</span>
                              {product.colors.slice(0, 3).map((color: string) => (
                                <span
                                  key={color}
                                  className="max-w-full text-[10px] font-medium text-gray-600 capitalize bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200/60 [overflow-wrap:anywhere]"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Pricing & Actions */}
                        <div className="pt-3 border-t border-gray-100 space-y-3">
                          <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-baseline justify-between gap-1.5 min-w-0">
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price</span>
                            <span className="font-black text-sm sm:text-base text-[#123B5D] tracking-tight [overflow-wrap:anywhere]">
                              {formattedPrice} <span className="text-xs font-bold text-gray-500">RWF</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 min-[640px]:grid-cols-2 gap-2">
                            <Link
                              href={`/shop/${product.id}`}
                              className="w-full min-w-0 bg-[#EEF3F6] text-[#123B5D] hover:bg-[#123B5D] hover:text-white font-bold text-xs leading-tight px-2 py-2.5 rounded-lg text-center transition-all flex items-center justify-center min-h-[38px] break-words"
                            >
                              View Details
                            </Link>
                            
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={isOutOfStock}
                              className={`w-full min-w-0 font-bold text-xs leading-tight px-2 py-2.5 rounded-lg transition-all flex items-center justify-center min-h-[38px] break-words ${
                                isOutOfStock
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : addedProductId === product.id
                                  ? 'bg-green-600 text-white'
                                  : 'bg-[#F28C28] text-[#111111] hover:bg-[#123B5D] hover:text-white shadow-sm'
                              }`}
                            >
                              {addedProductId === product.id ? '✓ Added' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Responsive Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 sm:mt-12 bg-white rounded-xl border border-gray-200/80 p-3 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm min-w-0">
                  {/* Item Counter */}
                  <div className="text-[11px] sm:text-xs text-gray-500 font-medium text-center lg:text-left break-words">
                    Showing{' '}
                    <span className="font-extrabold text-[#123B5D]">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-extrabold text-[#123B5D]">
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                    </span>{' '}
                    of{' '}
                    <span className="font-extrabold text-[#123B5D]">
                      {filteredProducts.length}
                    </span>{' '}
                    garments
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-full min-w-0">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : 'bg-[#EEF3F6] text-[#123B5D] hover:bg-[#123B5D] hover:text-white'
                      }`}
                      aria-label="Previous Page"
                    >
                      ← <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }).map((_, index: number) => {
                      const pageNum = index + 1;
                      const isActive = pageNum === currentPage;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center ${
                            isActive
                              ? 'bg-[#F28C28] text-[#111111] shadow-sm scale-105'
                              : 'bg-[#EEF3F6] text-[#123B5D] hover:bg-[#123B5D] hover:text-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : 'bg-[#EEF3F6] text-[#123B5D] hover:bg-[#123B5D] hover:text-white'
                      }`}
                      aria-label="Next Page"
                    >
                      <span className="hidden sm:inline">Next</span> →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}