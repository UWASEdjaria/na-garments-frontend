'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { CONTACT_INFO } from '@/app/lib/constants';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');
  const [hasReadyToWear, setHasReadyToWear] = useState(false);

  // Check if there are any ready-to-wear products available
  useEffect(() => {
    async function checkProducts() {
      try {
        const res = await fetch('/api/products?type=ready-to-wear');
        if (res.ok) {
          const data = await res.json();
          // Set to true if at least one ready-to-wear item exists
          if (data && data.length > 0) {
            setHasReadyToWear(true);
          }
        }
      } catch (error) {
        // Fallback: Default to Made-to-Order only if fetch fails
        setHasReadyToWear(false);
      }
    }
    checkProducts();
  }, []);

  const tabContent: Record<string, { title: string; subtitle: string; body: string[] }> = {
    story: {
      title: 'Our Roots in Kagugu, Kigali',
      subtitle: 'Crafting quality apparel with dedicated local expertise.',
      body: [
        'Nagarmentss is based near Batsinda Bus Park in Kagugu, Kigali. We built our workshop with a single core mission: to deliver reliable, high-standard custom apparel and uniform solutions for individuals, schools, and corporate institutions.',
        'From a focused tailoring workshop, we have grown into a trusted custom production brand across Rwanda.',
      ],
    },
    mission: {
      title: 'To Simplify Custom Apparel & Uniform Supply',
      subtitle: 'Streamlined production from design consultation to delivery.',
      body: [
        'We exist to remove the friction from bulk ordering and custom tailored outfits. Whether outfitting an entire academic institution or crafting a custom senator suit, we maintain absolute precision in fabric selection, cutting, and stitching.',
        'Our integrated workflow ensures clear communication, predictable lead times, and uncompromised finishing on every single order.',
      ],
    },
    craft: {
      title: 'Precision Craftsmanship & Durability',
      subtitle: 'Engineered for daily comfort and long-term wear.',
      body: [
        'High Durability: We source robust, color-fast materials and reinforce stress points to ensure uniforms withstand daily wear in schools, healthcare facilities, and industrial job sites.',
        'Tailored Accuracy: Every cut and seam is executed by skilled tailors dedicated to clean lines, elegant drape, and structural comfort.',
      ],
    },
    growth: {
      title: 'Serving Beyond Rwanda',
      subtitle: 'Scaling capacity while honoring personalized service.',
      body: [
        'While firmly anchored near Batsinda Bus Park in Kigali, Nagarmentss extends its services to regional clients and organizations.',
        'As our production volume expands, we continuously invest in modern equipment and structured quality control to guarantee that bulk orders match the exact standards of our individual custom pieces.',
      ],
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] font-sans text-[#111111] antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">

        {/* 1. HERO SECTION: Clean Heading & Paragraph */}
        <section className="py-4 space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#123B5D] tracking-tight leading-[1.15]">
            Custom Tailored Apparel, <br />
            <span className="text-[#F28C28]">Crafted in Kigali.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
            Custom tailoring and uniform supply based near Batsinda Bus Park in Kagugu, Kigali. Delivering precision and structure to every garment.
          </p>
        </section>

        {/* 2. WORKSHOP IMAGE DISPLAY CARD */}
        <section className="relative w-full h-[300px] sm:h-[420px] rounded-3xl overflow-hidden shadow-xl border border-gray-200">
          <Image
            src="https://res.cloudinary.com/ziwgo9pj/image/upload/v1793608334/abakozi_ba_sam.jpg"
            alt="Nagarmentss team tailoring in Kagugu workshop"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center"
            priority
          />
        </section>

        {/* 3. INTERACTIVE TABBED NAVIGATION & MISSION SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          
          {/* Left Vertical Tabs */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {[
              { id: 'story', label: 'Our Story & Origin' },
              { id: 'mission', label: 'Our Core Mission' },
              { id: 'craft', label: 'Precision Craftsmanship' },
              { id: 'growth', label: 'Serving Beyond Rwanda' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-200 whitespace-nowrap lg:whitespace-normal flex items-center justify-between group ${
                    isActive
                      ? 'bg-[#123B5D] text-white shadow-md shadow-[#123B5D]/10'
                      : 'bg-white text-gray-700 hover:bg-white/80 hover:text-[#123B5D] border border-gray-200/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-xs transition-transform ${isActive ? 'text-[#F28C28] translate-x-1' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`}>
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Active Content Box */}
          <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 min-h-[320px]">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">
                {activeTab.toUpperCase()}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B5D]">
                {tabContent[activeTab].title}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                {tabContent[activeTab].subtitle}
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-600">
              {tabContent[activeTab].body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

        </section>

        {/* 4. PRODUCTION CATALOG GRID */}
        <section className="rounded-3xl bg-white border border-gray-200/80 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">
                Production Range
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B5D] mt-1">
                What We Make to Order
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm">
              Custom tailored & institutional apparel produced directly from our Kagugu facility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'School uniforms for institutions across Rwanda',
              "Men's shirts (corporate & casual wear)",
              'Medical & healthcare wear',
              'T-shirts & polo shirts (Lacoste style)',
              'Kitenge & African print designs',
              'Safety vests & field jackets',
              'Safety overalls & industrial workwear',
              'Hoodies & custom sweaters',
              "Kids' clothing",
              'Evening & party dresses',
              "Women's corporate & formal wear",
              'Graduation & ceremony dresses',
              'Caps & promotional headwear',
              'Hospitality & culinary uniforms',
              'Engineering & utility wear',
              "Men's traditional wear & senator suits",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-2xl bg-[#EEF3F6]/50 border border-gray-100 hover:border-[#123B5D]/20 transition-colors group"
              >
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[#F28C28] text-[#111111] flex items-center justify-center text-[10px] font-bold shadow-sm">
                  ✓
                </span>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-[#123B5D] transition-colors">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. LOCATION & CALL TO ACTION GRID */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Location Details Box */}
          <div className="md:col-span-6 rounded-3xl bg-white border border-gray-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">
                Visit Our Workshop
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#123B5D]">Find Us in Kigali</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {CONTACT_INFO.locationDisplay || 'Located near Batsinda Bus Park in Kagugu, Kigali.'}
              </p>
            </div>
            <a
              href={CONTACT_INFO.locationMapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#123B5D] hover:text-[#F28C28] transition-colors group"
            >
              <span>View Workshop Location on Google Maps</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          {/* Action Link Buttons (Dynamically Hides/Shows Ready-To-Wear) */}
          <div className="md:col-span-6 rounded-3xl bg-[#123B5D] p-6 sm:p-8 shadow-md flex flex-col justify-center space-y-3">
            
            {/* Show "Browse Ready Collection" ONLY if admin has uploaded ready-to-wear items */}
            {hasReadyToWear && (
              <Link
                href="/shop"
                className="w-full rounded-2xl bg-[#F28C28] px-6 py-4 text-center text-sm font-bold text-[#111111] hover:bg-white hover:text-[#123B5D] transition-all shadow-sm"
              >
                Browse Ready Collection
              </Link>
            )}

            {/* Always Show Custom Order */}
            <Link
              href="/custom-order"
              className={`w-full rounded-2xl px-6 py-4 text-center text-sm font-bold transition-all ${
                hasReadyToWear
                  ? 'border-2 border-white/80 text-white hover:bg-white hover:text-[#123B5D]'
                  : 'bg-[#F28C28] text-[#111111] hover:bg-white hover:text-[#123B5D] shadow-sm'
              }`}
            >
              Request a Custom Order
            </Link>

            {/* Contact Button when Ready-To-Wear is absent */}
            {!hasReadyToWear && (
              <Link
                href="/contact"
                className="w-full rounded-2xl border-2 border-white/80 px-6 py-4 text-center text-sm font-bold text-white hover:bg-white hover:text-[#123B5D] transition-all"
              >
                Contact Our Workshop
              </Link>
            )}

          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}