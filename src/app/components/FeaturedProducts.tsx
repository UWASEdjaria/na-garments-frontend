'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
          <div className="relative h-52 sm:h-48 w-full bg-gray-100">
            <Image
              src={productService.getPrimaryImageUrl(product)}
              alt={product.name}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-semibold text-[#123B5D] uppercase tracking-wide">
                {product.category?.name}
              </span>

              <h3 className="font-bold text-sm text-[#111111] mt-1 line-clamp-1 break-words">
                {product.name}
              </h3>

              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs text-gray-400 block">
                  Price
                </span>

                <span className="font-extrabold text-sm text-[#123B5D] break-words">
                  {product.price.toLocaleString()} RWF
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}