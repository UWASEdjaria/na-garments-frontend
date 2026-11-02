'use client';

import {
  Suspense,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
} from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Product, Category } from '@/app/types';
import { productService } from '@/app/services/product.service';
import { cartService } from '@/app/services/cart.service';
import { FiHeart } from 'react-icons/fi';
import { wishlistService } from '@/app/services/wishlist.service';
import FadeIn from '../components/animations/FadeIn';
import SlideUp from '../components/animations/SlideUp';
import { useCurrency } from '@/app/components/CurrencyProvider';
import { useToast } from '@/app/components/ToastProvider';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

const ITEMS_PER_PAGE = 10;

function ShopContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search')?.trim() || '',
  );
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState<string | null>(
    null,
  );

  const { format } = useCurrency();
  const loadData = useCallback(async (background = false) => {
    if (!background) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const search = searchParams.get('search')?.trim() || '';

      const [fetchedProducts, fetchedCategories] = await Promise.all([
        productService.getAllProducts({ search }),
        productService.getCategories(),
      ]);

      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setError(null);
    } catch (err) {
      if (!background) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch shop inventory.');
        }
      }
    } finally {
      if (!background) {
        setIsLoading(false);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    void loadData();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadData();
      }
    };

    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadData]);

  useEffect(() => {
    const categorySlug = searchParams.get('category');

    if (!categorySlug) {
      setSelectedCategory('all');
      return;
    }

    const category = categories.find((item) => item.slug === categorySlug);

    if (category) {
      setSelectedCategory(category.id);
    }
  }, [searchParams, categories]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!localStorage.getItem('token')) return;

      try {
        const response = await wishlistService.getWishlist();

        setWishlistProductIds(
          response.data.map((item) => item.productId),
        );
      } catch {
        setWishlistProductIds([]);
      }
    };

    loadWishlist();
  }, []);

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
          product.description.toLowerCase().includes(query),
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter(
        (product: Product) => product.categoryId === selectedCategory,
      );
    }

    list.sort((a: Product, b: Product) => {
      if (sortBy === 'price-asc' || sortBy === 'price-desc') {
        const aPrice =
          a.price == null ||
          String(a.price).trim() === '' ||
          !Number.isFinite(Number(a.price))
            ? null
            : Number(a.price);

        const bPrice =
          b.price == null ||
          String(b.price).trim() === '' ||
          !Number.isFinite(Number(b.price))
            ? null
            : Number(b.price);

        if (aPrice === null) return bPrice === null ? 0 : 1;
        if (bPrice === null) return -1;

        return sortBy === 'price-asc'
          ? aPrice - bPrice
          : bPrice - aPrice;
      }

      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const hasPricedProducts = filteredProducts.some(
    (product: Product) =>
      product.price != null &&
      String(product.price).trim() !== '' &&
      Number.isFinite(Number(product.price)),
  );

  useEffect(() => {
    if (
      !hasPricedProducts &&
      (sortBy === 'price-asc' || sortBy === 'price-desc')
    ) {
      setSortBy('newest');
    }
  }, [hasPricedProducts, sortBy]);

  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE,
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
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
    if (addedProductId === product.id) {
      window.location.assign('/cart');
      return;
    }

    try {
      await cartService.addToCart(product);
      setAddedProductId(product.id);

      showToast({
        type: 'success',
        title: 'Added to cart',
        description: `${product.name} was added to your cart. Select View Cart to continue.`,
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Could not add to cart',
        description: 'Please try again.',
      });
    }
  };

  const handleWishlistToggle = async (productId: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
      showToast({
        type: 'info',
        title: 'Login required',
        description: 'Please log in or create an account to add products to your wishlist.',
      });
      return;
    }

    const isWishlisted = wishlistProductIds.includes(productId);
    setWishlistLoadingId(productId);

    try {
      if (isWishlisted) {
        await wishlistService.removeItem(productId);
        setWishlistProductIds((current) =>
          current.filter((id) => id !== productId),
        );
        showToast({
          type: 'success',
          title: 'Removed from wishlist',
          description: 'This product has been removed from your wishlist.',
        });
      } else {
        await wishlistService.addItem(productId);
        setWishlistProductIds((current) => [...current, productId]);
        showToast({
          type: 'success',
          title: 'Added to wishlist',
          description: 'This product has been saved to your wishlist.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Wishlist update failed',
        description: 'We could not update your wishlist. Please try again.',
      });
    } finally {
      setWishlistLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full min-w-0 flex flex-col bg-[#EEF3F6] text-[#111111] antialiased selection:bg-[#F28C28] selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="flex-grow w-full min-w-0 pb-8 sm:pb-12">
        {/* Compact Banner */}
        <section className="bg-[#123B5D] text-white py-4 sm:py-6 px-3 sm:px-5 lg:px-7 shadow-sm">
          <div className="max-w-7xl w-full min-w-0 mx-auto text-center space-y-1.5">
            <FadeIn>
              <span className="inline-block max-w-full break-words text-[10px] sm:text-xs font-bold text-[#F28C28] uppercase tracking-widest bg-[#123B5D]/60 px-2.5 py-1 rounded-full border border-[#F28C28]/30">
                Made-to-Order & Ready-to-Wear
              </span>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight break-words">
                Explore Our Designs &amp; Collection
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-xs text-[#EEF3F6]/90 max-w-xl mx-auto leading-relaxed break-words">
                Explore precision-cut menswear, institutional apparel, and
                master-tailored garments handcrafted in Kigali.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Compact Search, Filter & Controls */}
        <section className="max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-5 lg:px-7 pt-3">
          <SlideUp>
            <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200/80 shadow-sm space-y-2 min-w-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <div className="relative flex-1 min-w-0 w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <input
                    type="text"
                    placeholder="Search garments by name or description..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full min-w-0 bg-[#EEF3F6] text-[#111111] placeholder-gray-500 text-xs pl-9 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#123B5D] focus:bg-white transition-all"
                  />

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-[#111111] font-bold"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex flex-col min-[400px]:flex-row items-stretch min-[400px]:items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 w-full sm:w-auto">
                  <label
                    htmlFor="sort"
                    className="text-xs font-bold text-[#123B5D] uppercase tracking-wider shrink-0"
                  >
                    Sort By:
                  </label>

                  <select
                    id="sort"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="w-full min-[400px]:w-auto min-w-0 bg-[#EEF3F6] text-[#111111] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#123B5D] cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    {hasPricedProducts && (
                      <>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </>
                    )}
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto overscroll-x-contain pb-1 pt-2 border-t border-gray-100 no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 ${
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
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 ${
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
          </SlideUp>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-5 lg:px-7 pt-3">
          {/* Loading State */}
          {isLoading && (
            <div
              role="status"
              aria-label="Loading garments"
              className="space-y-2"
            >
              <p className="text-center text-xs font-medium text-[#64748B]">
                Loading garments...
              </p>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {Array.from({ length: 8 }).map((_, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200/80 p-3 animate-pulse space-y-3 min-w-0"
                  >
                    <div className="aspect-[4/5] bg-gray-200 rounded-lg w-full" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="bg-white border border-red-100 p-5 sm:p-8 rounded-xl text-center max-w-md w-full min-w-0 mx-auto space-y-3 shadow-sm my-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-lg font-bold">
                !
              </div>

              <h3 className="font-bold text-sm sm:text-base text-[#111111] break-words">
                Unable to load products
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed break-words">
                {error}
              </p>

              <button
                onClick={() => void loadData()}
                className="w-full sm:w-auto bg-[#123B5D] text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-lg hover:bg-[#F28C28] hover:text-[#111111] transition-colors shadow-sm"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="bg-white border border-gray-200/80 p-5 sm:p-8 rounded-xl text-center max-w-md w-full min-w-0 mx-auto space-y-3 shadow-sm my-4">
              <div className="w-10 h-10 rounded-full bg-[#EEF3F6] text-[#123B5D] flex items-center justify-center mx-auto text-lg font-bold">
                🔍
              </div>

              <h3 className="font-bold text-sm sm:text-base text-[#123B5D] break-words">
                No garments found
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed break-words">
                We couldn&apos;t find any items matching your current filters
                or search query.
              </p>

              <button
                onClick={handleClearFilters}
                className="w-full sm:w-auto bg-[#123B5D] text-white hover:bg-[#0D2D47] font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-lg transition-colors shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Clean White Background Cards with Text Below */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <>
              <SlideUp>
                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {paginatedProducts.map((product: Product) => {
                    const imageUrl =
                      productService.getPrimaryImageUrl(product);

                    const isOutOfStock =
                      !product.isAvailable || product.stockQuantity <= 0;

                    const isWishlisted = wishlistProductIds.includes(product.id);

                    return (
                      <div
                        key={product.id}
                        className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* Top Image Frame with White Background & Wishlist Heart */}
                        <div className="relative aspect-[4/5] w-full bg-white overflow-hidden flex items-center justify-center">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 z-10">
                            {product.productType === 'MADE_TO_ORDER' ? (
                              <span className="inline-flex rounded-full bg-[#FFF0DF]/90 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-[#9A4D00] shadow-sm">
                                Made to Order
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-[#DBEAFE]/90 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-[#123B5D] shadow-sm">
                                Ready to Wear
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleWishlistToggle(product.id)}
                            disabled={wishlistLoadingId === product.id}
                            aria-label={
                              isWishlisted
                                ? 'Remove from wishlist'
                                : 'Add to wishlist'
                            }
                            className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
                              isWishlisted
                                ? 'bg-[#123B5D] text-white'
                                : 'bg-white/90 backdrop-blur-sm text-[#123B5D] hover:bg-[#123B5D] hover:text-white'
                            }`}
                          >
                            <FiHeart className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Card Content Below Image */}
                        <div className="p-3.5 flex flex-1 flex-col justify-between bg-white border-t border-gray-100">
                          <div className="space-y-1">
                            {product.category?.name && (
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] block">
                                {product.category.name}
                              </span>
                            )}

                            <h2 className="font-serif text-sm sm:text-base font-bold text-[#111111] leading-snug line-clamp-1 group-hover:text-[#123B5D] transition-colors">
                              {product.name}
                            </h2>

                            <p className="text-[11px] text-gray-500 line-clamp-1">
                              {product.description ||
                                'Custom tailored garment crafted with precision.'}
                            </p>
                          </div>

                          {/* Pricing & Actions */}
                          <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-2">
                            {product.productType === 'MADE_TO_ORDER' ? (
                              <>
                                <p className="text-[10px] text-gray-400 italic">Price on request</p>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <Link
                                    href={`/shop/${product.id}`}
                                    className="flex min-h-[32px] items-center justify-center rounded-lg bg-[#EEF3F6] px-1 text-center text-[11px] font-bold text-[#123B5D] transition-all hover:bg-[#123B5D] hover:text-white"
                                  >
                                    Details
                                  </Link>
                                  <Link
                                    href={`/custom-order?productId=${product.id}&garmentType=${encodeURIComponent(product.name)}`}
                                    className="flex min-h-[32px] items-center justify-center rounded-lg bg-[#F28C28] px-1 text-center text-[11px] font-bold text-[#111111] transition-all hover:bg-[#123B5D] hover:text-white"
                                  >
                                    Request Quote
                                  </Link>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-baseline justify-between">
                                  <span className="font-black text-sm sm:text-base text-[#111111] tracking-tight">
                                    {format(Number(product.price))}
                                  </span>
                                  {isOutOfStock && (
                                    <span className="text-[9px] font-bold text-red-600 uppercase">Sold Out</span>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-1.5">
                                  <Link
                                    href={`/shop/${product.id}`}
                                    className="flex min-h-[32px] items-center justify-center rounded-lg bg-[#EEF3F6] px-1 text-center text-[11px] font-bold text-[#123B5D] transition-all hover:bg-[#123B5D] hover:text-white"
                                  >
                                    Details
                                  </Link>

                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={isOutOfStock}
                                    className={`flex min-h-[32px] items-center justify-center rounded-lg px-1 text-center text-[11px] font-bold transition-all ${
                                      isOutOfStock
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : addedProductId === product.id
                                        ? 'bg-green-600 text-white'
                                        : 'bg-[#F28C28] text-[#111111] hover:bg-[#123B5D] hover:text-white shadow-sm'
                                    }`}
                                  >
                                    {isOutOfStock
                                      ? 'Sold Out'
                                      : addedProductId === product.id
                                      ? 'Cart'
                                      : 'Add to Cart'}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SlideUp>

              {/* Pagination */}
              {totalPages > 1 && (
                <FadeIn delay={0.15}>
                  <div className="mt-6 bg-white rounded-xl border border-gray-200/80 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                    <div className="text-xs text-gray-500 font-medium">
                      Showing{' '}
                      <span className="font-extrabold text-[#123B5D]">
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-extrabold text-[#123B5D]">
                        {Math.min(
                          currentPage * ITEMS_PER_PAGE,
                          filteredProducts.length,
                        )}
                      </span>{' '}
                      of{' '}
                      <span className="font-extrabold text-[#123B5D]">
                        {filteredProducts.length}
                      </span>{' '}
                      garments
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-[#EEF3F6] text-[#123B5D] hover:bg-[#123B5D] hover:text-white'
                        }`}
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }).map(
                        (_, index: number) => {
                          const pageNum = index + 1;
                          const isActive = pageNum === currentPage;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-9 h-9 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center ${
                                isActive
                                  ? 'bg-[#123B5D] text-white shadow-sm'
                                  : 'bg-[#EEF3F6] text-[#123B5D] hover:bg-[#123B5D] hover:text-white'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-[#EEF3F6] text-[#123B5D] hover:bg-[#123B5D] hover:text-white'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </FadeIn>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#EEF3F6] text-[#123B5D]">
          <p className="text-sm font-bold">Loading shop collection...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}