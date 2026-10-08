'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

import { Product } from '@/app/types';
import { productService } from '@/app/services/product.service';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts.slice(0, 4));
    }

    loadProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col min-w-0"
        >
          <Link
            href={`/shop/${product.id}`}
            className="block"
            aria-label={`View ${product.name}`}
          >
            <div className="relative h-52 sm:h-48 w-full bg-gray-100">
              <Image
                src={productService.getPrimaryImageUrl(product)}
                alt={product.name}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                className="object-contain p-3 transition-transform duration-300 hover:scale-105"
                unoptimized
              />
            </div>

            <div className="p-4">
              <span className="text-[11px] font-semibold text-[#123B5D] uppercase tracking-wide">
                {product.category?.name}
              </span>

              <h3 className="font-bold text-sm text-[#111111] mt-1 line-clamp-2 break-words">
                {product.name}
              </h3>

              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
          </Link>

          <div className="px-4 pb-4 mt-auto">
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
              <span className="font-extrabold text-sm text-[#123B5D] break-words">
                {product.price.toLocaleString()} RWF
              </span>

              <Link
                href={`/shop/${product.id}`}
                className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#123B5D] hover:text-[#F28C28] transition-colors"
              >
                View Details
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}