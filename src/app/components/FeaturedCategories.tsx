'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/app/types';
import { productService } from '@/app/services/product.service';

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const fetchedCategories = await productService.getCategories();
      setCategories(fetchedCategories.slice(0, 3));
    }

    loadCategories();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 min-w-0">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group min-w-0"
        >
          <div className="relative aspect-square w-full bg-[#F8FAFC] p-4 overflow-hidden flex items-center justify-center">
            <Image
              src={category.imageUrl || '/images/placeholder-garment.jpg'}
              alt={category.name}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-contain group-hover:scale-105 transition-transform duration-300 p-2"
              unoptimized
            />
          </div>

          <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#123B5D] mb-2 group-hover:text-[#F28C28] transition-colors break-words">
                {category.name}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {category.description}
              </p>
            </div>

            <Link
              href={`/shop?category=${category.slug}`}
              className="w-full bg-[#EEF3F6] text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded text-center transition-colors block"
            >
              View Collection
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}