'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/types';
import { productService } from '@/app/services/product.service';
import { cartService } from '@/app/services/cart.service';
import { wishlistService } from '@/app/services/wishlist.service';
import { FiHeart } from 'react-icons/fi';
import { useCurrency } from '@/app/components/CurrencyProvider';
import { useToast } from '@/app/components/ToastProvider';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState<string | null>(null);

  const { format } = useCurrency();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        setIsLoading(true);
        const fetchedProducts = await productService.getAllProducts();
        setProducts(fetchedProducts.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!localStorage.getItem('token')) return;
      try {
        const response = await wishlistService.getWishlist();
        setWishlistProductIds(response.data.map((item) => item.productId));
      } catch {
        setWishlistProductIds([]);
      }
    };

    loadWishlist();
  }, []);

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
        setWishlistProductIds((current) => current.filter((id) => id !== productId));
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse space-y-3">
            <div className="aspect-[4/5] w-full rounded-2xl bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
            <div className="h-3 w-3/4 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
      {products.map((product) => {
        const imageUrl = productService.getPrimaryImageUrl(product);
        const isOutOfStock = !product.isAvailable || product.stockQuantity <= 0;
        const isWishlisted = wishlistProductIds.includes(product.id);

        return (
          <div
            key={product.id}
            className="group relative flex flex-col bg-transparent"
          >
            {/* Rounded Image Container matching reference style */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center shadow-sm">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />

              {/* Top Badges */}
              <div className="absolute top-3 left-3 z-10">
                {product.productType === 'MADE_TO_ORDER' ? (
                  <span className="inline-flex rounded-full bg-[#FFF0DF]/95 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-[#9A4D00] shadow-sm">
                    Made to Order
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-[#DBEAFE]/95 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-[#123B5D] shadow-sm">
                    Ready to Wear
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => handleWishlistToggle(product.id)}
                disabled={wishlistLoadingId === product.id}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
                  isWishlisted
                    ? 'bg-[#123B5D] text-white'
                    : 'bg-white/95 text-[#123B5D] backdrop-blur-sm hover:bg-[#123B5D] hover:text-white'
                }`}
              >
                <FiHeart className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Clean Content Block Below Rounded Image */}
            <div className="pt-3.5 px-1 flex flex-1 flex-col justify-between space-y-2">
              <div className="space-y-0.5">
                {product.category?.name && (
                  <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    {product.category.name}
                  </span>
                )}

                <h3 className="font-serif text-sm font-bold leading-snug text-[#111111] line-clamp-1 group-hover:text-[#123B5D] transition-colors sm:text-base">
                  {product.name}
                </h3>

                <p className="text-[11px] text-gray-600 line-clamp-1">
                  {product.description || 'Custom tailored garment crafted with precision.'}
                </p>
              </div>

              {/* Pricing & Actions */}
              <div className="space-y-2 pt-1">
                {product.productType === 'MADE_TO_ORDER' ? (
                  <>
                    <p className="text-[11px] italic text-gray-500">Price on request</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <Link
                        href={`/shop/${product.id}`}
                        className="flex min-h-[32px] items-center justify-center rounded-lg bg-white border border-gray-200 px-1 text-center text-[11px] font-bold text-[#123B5D] transition-all hover:bg-[#123B5D] hover:text-white shadow-sm"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/custom-order?productId=${product.id}&garmentType=${encodeURIComponent(product.name)}`}
                        className="flex min-h-[32px] items-center justify-center rounded-lg bg-[#F28C28] px-1 text-center text-[11px] font-bold text-[#111111] transition-all hover:bg-[#123B5D] hover:text-white shadow-sm"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline justify-between">
                      <span className="font-black text-sm tracking-tight text-[#111111] sm:text-base">
                        {format(Number(product.price))}
                      </span>
                      {isOutOfStock && (
                        <span className="text-[9px] font-bold uppercase text-red-600">Sold Out</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <Link
                        href={`/shop/${product.id}`}
                        className="flex min-h-[32px] items-center justify-center rounded-lg bg-white border border-gray-200 px-1 text-center text-[11px] font-bold text-[#123B5D] transition-all hover:bg-[#123B5D] hover:text-white shadow-sm"
                      >
                        Details
                      </Link>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock}
                        className={`flex min-h-[32px] items-center justify-center rounded-lg px-1 text-center text-[11px] font-bold transition-all ${
                          isOutOfStock
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200'
                            : addedProductId === product.id
                            ? 'bg-green-600 text-white'
                            : 'bg-[#F28C28] text-[#111111] shadow-sm hover:bg-[#123B5D] hover:text-white'
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
  );
}