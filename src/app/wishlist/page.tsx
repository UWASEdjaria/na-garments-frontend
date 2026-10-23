'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiHeart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { wishlistService } from '@/app/services/wishlist.service';
import { productService } from '@/app/services/product.service';
import { useCurrency } from '@/app/components/CurrencyProvider';
import type { Product } from '@/app/types';

interface WishlistEntry {
  id: string;
  productId: string;
  product?: Product;
}

export default function WishlistPage() {
  const router = useRouter();
  const { format } = useCurrency();
  const [entries, setEntries] = useState<WishlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.replace('/auth/login'); return; }

    async function load() {
      try {
        const res = await wishlistService.getWishlist();
        const withProducts = await Promise.all(
          res.data.map(async (item) => {
            try {
              const product = await productService.getProductById(item.productId);
              return { ...item, product };
            } catch {
              return { ...item };
            }
          })
        );
        setEntries(withProducts);
      } catch {
        setError('Unable to load your wishlist.');
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [router]);

  const handleRemove = async (productId: string) => {
    await wishlistService.removeItem(productId);
    setEntries((current) => current.filter((e) => e.productId !== productId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/shop" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#123B5D] hover:text-[#F28C28] transition-colors">
          <FiArrowLeft aria-hidden="true" /> Back to Shop
        </Link>

        <h1 className="text-2xl font-extrabold text-[#123B5D] sm:text-3xl mb-6">My Wishlist</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200" />)}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-sm text-red-700">{error}</div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center shadow-sm">
            <FiHeart className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-lg font-bold text-[#123B5D]">Your wishlist is empty</h2>
            <p className="mt-2 text-sm text-gray-500">Save items you love and come back to them later.</p>
            <Link href="/shop" className="mt-6 inline-block rounded-lg bg-[#F28C28] px-6 py-3 text-sm font-bold text-[#111111] hover:bg-[#123B5D] hover:text-white transition-colors">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => {
              const product = entry.product;
              if (!product) return null;
              const isMadeToOrder = product.productType === 'MADE_TO_ORDER';
              const imageUrl = productService.getPrimaryImageUrl(product);
              return (
                <div key={entry.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="relative aspect-square bg-[#F8FAFC]">
                    <Image src={imageUrl} alt={product.name} fill unoptimized className="object-contain p-3" />
                    {isMadeToOrder && (
                      <span className="absolute top-2 left-2 rounded-full bg-[#FFF0DF] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#9A4D00]">
                        Made to Order
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#123B5D]">{product.category?.name}</p>
                    <h2 className="mt-1 font-bold text-sm text-[#111111] line-clamp-2">{product.name}</h2>
                    <p className="mt-1 text-sm font-extrabold text-[#123B5D]">
                      {isMadeToOrder ? 'Price on request' : format(Number(product.price))}
                    </p>
                    <div className="mt-auto pt-3 flex gap-2">
                      <Link
                        href={isMadeToOrder ? `/custom-order?productId=${product.id}&garmentType=${encodeURIComponent(product.name)}` : `/shop/${product.id}`}
                        className="flex-1 rounded-lg bg-[#F28C28] px-3 py-2 text-center text-xs font-bold text-[#111111] hover:bg-[#123B5D] hover:text-white transition-colors"
                      >
                        {isMadeToOrder ? 'Request Quote' : 'View Details'}
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleRemove(entry.productId)}
                        aria-label="Remove from wishlist"
                        className="rounded-lg border border-gray-200 p-2 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}



