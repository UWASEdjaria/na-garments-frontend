import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { CONTACT_INFO } from '@/app/lib/constants';

export const metadata = { title: 'About nagarments' };

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10">

        {/* Hero */}
        <section className="rounded-2xl bg-[#123B5D] text-white px-6 py-10 sm:px-10 sm:py-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Our Story</span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            Clothing Made in Kigali,<br />Serving Beyond Rwanda
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#EEF3F6]/90 max-w-2xl">
            nagarments is based in Kagugu, Batsinda, near Batsinda Bus Park in Kigali. We make school uniforms,
            workwear, men&apos;s clothing, ready-to-wear pieces, and clothing made to order for individuals,
            schools, and businesses.
          </p>
        </section>

        {/* What we do */}
        <section className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-[#123B5D]">What We Make</h2>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            {[
              'School uniforms for institutions across Rwanda',
              'Industrial and engineering workwear',
              'Corporate and security uniforms',
              "Men's fashion and everyday clothing",
              'Ready-to-wear garments available for immediate purchase',
              'Made-to-order designs tailored to your exact requirements',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[#F28C28] text-[#111111] flex items-center justify-center text-[10px] font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Location */}
        <section className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-[#123B5D]">Find Us</h2>
          <p className="mt-3 text-sm text-gray-700">{CONTACT_INFO.locationDisplay}</p>
          <a
            href={CONTACT_INFO.locationMapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-bold text-[#123B5D] hover:text-[#F28C28] transition-colors"
          >
            View on Google Maps →
          </a>
        </section>

        {/* CTA */}
        <section className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="flex-1 rounded-lg bg-[#F28C28] px-6 py-3 text-center text-sm font-bold text-[#111111] hover:bg-[#123B5D] hover:text-white transition-colors">
            Browse Our Collection
          </Link>
          <Link href="/custom-order" className="flex-1 rounded-lg border-2 border-[#123B5D] px-6 py-3 text-center text-sm font-bold text-[#123B5D] hover:bg-[#123B5D] hover:text-white transition-colors">
            Request a Custom Order
          </Link>
          <Link href="/contact" className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 text-center text-sm font-bold text-gray-700 hover:border-[#123B5D] hover:text-[#123B5D] transition-colors">
            Contact Us
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
