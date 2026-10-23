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
      setCategories(fetchedCategories);
    }

    loadCategories();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 auto-rows-fr">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/shop?category=${category.slug}`}
          aria-label={`Browse ${category.name} designs`}
          className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123B5D]"
        >
          <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#F8FAFC] p-4">
            <Image
              src={category.imageUrl || '/images/placeholder-garment.jpg'}
              alt={category.name}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <h3 className="mb-3 text-xl font-bold text-[#123B5D] transition-colors duration-200 group-hover:text-[#F28C28]">
              {category.name}
            </h3>

            <p className="line-clamp-3 min-h-[4.5rem] flex-1 text-sm leading-relaxed text-gray-600">
              {category.description || 'Explore garment designs in this category.'}
            </p>

            <div className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#EEF3F6] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#123B5D] transition-colors duration-200 group-hover:bg-[#123B5D] group-hover:text-white">
              Browse Designs
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                â†’
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
