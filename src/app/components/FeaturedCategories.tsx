'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/app/types';
import { productService } from '@/app/services/product.service';
import { FiArrowUpRight } from 'react-icons/fi';

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    async function loadCategories() {
      try {
        const fetchedCategories = await productService.getCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }

    loadCategories();
  }, []);

  if (categories.length === 0) return null;

  const displayCategories = categories.slice(0, 4);

  return (
    <div className="w-full">
      {/* Responsive layout: Clean grid of portrait cards on mobile/tablet, expanding horizontal accordion on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:h-[520px] gap-6 lg:gap-4 transition-all duration-500 ease-in-out">
        {displayCategories.map((category, index) => {
          const isActive = activeIndex === index;
          const imageUrl = category.imageUrl || '/images/placeholder-garment.jpg';

          return (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              aria-label={`Browse ${category.name}`}
              className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isActive ? 'lg:flex-[3]' : 'lg:flex-[1] opacity-90 hover:opacity-100'
              } h-[420px] lg:h-full bg-neutral-900 shadow-lg`}
            >
              {/* Original Image as Full Card Background (object-cover) */}
              <div className="absolute inset-0">
                <Image
                  src={imageUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  unoptimized
                />
              </div>

              {/* Gradient Overlay for Text Legibility at the Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90" />

              {/* Number Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                  0{index + 1}
                </span>
              </div>

              {/* Floating Arrow Icon (Desktop hover) */}
              <div
                className={`absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-all duration-500 ${
                  isActive ? 'lg:opacity-100 lg:scale-100' : 'lg:opacity-0 lg:scale-75'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <FiArrowUpRight className="h-6 w-6" />
                </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10 p-6 text-white space-y-1.5">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#F28C28]">
                  Featured Category
                </span>

                <h3 className="font-serif font-bold text-white text-xl sm:text-2xl">
                  {category.name}
                </h3>

                <p className="text-xs sm:text-sm leading-relaxed text-gray-200 line-clamp-2">
                  {category.description || 'Explore custom garment designs handcrafted with quality fabrics.'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}