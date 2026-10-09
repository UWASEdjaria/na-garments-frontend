import FadeIn from '@/app/components/animations/FadeIn';
import SlideUp from '@/app/components/animations/SlideUp';
import MarqueeText from '@/app/components/animations/MarqueeText';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoginSuccessNotice from '@/app/components/auth/LoginSuccessNotice';
import { CONTACT_INFO, TAILORING_STEPS, WHY_CHOOSE_US } from './lib/constants';
import FeaturedProducts from './components/FeaturedProducts';
import FeaturedCategories from './components/FeaturedCategories';


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111111] overflow-x-hidden">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <LoginSuccessNotice />
      </div>


      <main className="flex-grow space-y-12 sm:space-y-16 lg:space-y-24 pb-12 sm:pb-16 lg:pb-24">
        {/* 1. Hero Section */}
        <section className="relative min-h-[70vh] sm:min-h-[75vh] flex items-center bg-[#111111] text-white py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F28C28] overflow-hidden">
          {/* Full-width Cloudinary Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://res.cloudinary.com/ziwgo9pj/image/upload/v1791035645/maiye-jeremiah-yIWFOg5yidA-unsplash.jpg"
              alt="nagarments Bespoke Fitting & Tailoring"
              fill
              priority
              sizes="100vw"
              unoptimized
              className="object-cover object-[70%_center] sm:object-[70%_center] lg:object-[75%_center]"
            />

            {/* Overlay using nagarments brand colors */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#123B5D]/95 via-[#123B5D]/85 to-[#111111]/40 sm:from-[#123B5D]/95 sm:via-[#123B5D]/80 sm:to-[#111111]/25" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="max-w-2xl space-y-6 text-center sm:text-left">
             <FadeIn>
              <span className="inline-block bg-[#F28C28] text-[#111111] text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
                Precision Apparel & Bespoke Fitting
              </span>
             </FadeIn>

             <FadeIn delay={0.1}>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight break-words">
                Custom Tailoring & Quality Apparel in Kigali
                <br className="hidden sm:inline" />{' '}
                <span className="text-[#F28C28]">
                  Made to Fit Your Needs.
                </span>
              </h1>
              </FadeIn>
              
             <FadeIn delay={0.2}>
              <p className="text-sm sm:text-base lg:text-lg text-[#EEF3F6]/90 max-w-2xl mx-auto sm:mx-0 leading-relaxed break-words">
                We make practical, well-fitted clothing for schools, workplaces, businesses, and everyday wear, with options for both
                ready-made and made-to-measure orders in Kigali.
              </p>
             </FadeIn>
              <FadeIn delay={0.3}>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto bg-[#F28C28] text-[#111111] hover:bg-white hover:text-[#123B5D] font-bold text-sm px-6 py-3.5 rounded shadow-md transition-all text-center min-h-[44px] flex items-center justify-center"
                >
                  Explore Collections
                </Link>

                <Link
                  href="/custom-order"
                  className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#123B5D] font-bold text-sm px-6 py-3.5 rounded transition-all text-center min-h-[44px] flex items-center justify-center"
                >
                  Order Custom Garment
                </Link>
              </div>
            </FadeIn>
            
             <FadeIn delay={0.4}>
              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-1 min-[400px]:grid-cols-3 gap-4 min-[400px]:gap-2 border-t border-white/20 text-center max-w-md mx-auto sm:mx-0 text-xs text-[#EEF3F6]/80">
                <div>
                  <span className="block font-bold text-white text-sm">
                     Custom orders
                  </span>
                  Made to Fit
                </div>

                <div>
                  <span className="block font-bold text-white text-sm">
                    Quality Fabrics
                  </span>
                  Selected with care
                </div>

                <div>
                  <span className="block font-bold text-white text-sm">
                    Local Craft
                  </span>
                  Kigali Atelier
                </div>
              </div>
             </FadeIn>
            </div>
          </div>
        </section>
        
        {/* 2. Moving Brand Strip */}
        <section className="bg-white border-y border-[#EEF3F6] py-4">
          <MarqueeText duration={35}>
            <div className="flex items-center gap-8 px-4">
              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Custom Tailoring
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Ready-to-Wear
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Institutional Uniforms
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Industrial Workwear
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Men&apos;s Fashion
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Made to Measure
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Quality Craftsmanship
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Designed For You
              </span>

              <span className="text-[#F28C28]">•</span>
            </div>
          </MarqueeText>
        </section>
        {/* 3. Featured Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-14">
            <span className="text-xs font-bold text-[#F28C28] uppercase tracking-widest block mb-1">
              Garment Categories
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#123B5D] tracking-tight break-words">
              Shop by Clothing Type
            </h2>

            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Browse clothing for school, work, business, and everyday use, all in one place.
            </p>
          </div>
        <FeaturedCategories />
        </section>

        {/* 4. Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#F28C28] uppercase tracking-widest block mb-1">
                Handcrafted Apparel
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#123B5D] tracking-tight break-words">
                Browse Popular Garments
              </h2>
            </div>

            <Link
              href="/shop"
              className="text-sm font-bold text-[#123B5D] hover:text-[#F28C28] transition-colors inline-flex items-center gap-1 shrink-0"
            >
              View All Products &rarr;
            </Link>
          </div>

          <FeaturedProducts />
        </section>

        {/* 5. Custom Tailoring CTA Section */}
        <section className="bg-[#123B5D] text-white py-12 sm:py-16 lg:py-20 border-y-4 border-[#F28C28]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">
              <span className="text-xs font-bold text-[#F28C28] uppercase tracking-widest block mb-2">
                From Choice to Fitting
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight break-words">
                How a Custom Order Works
              </h2>

              <p className="text-sm sm:text-base text-[#EEF3F6]/80 mt-3 leading-relaxed">
                From choosing your style to the final fitting, we guide you through a simple four-step process.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {TAILORING_STEPS.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-[#111111]/40 border border-white/10 p-4 sm:p-6 rounded-lg relative flex flex-col justify-between min-w-0"
                >
                  <div>
                    <span className="w-10 h-10 rounded-full bg-[#F28C28] text-[#111111] font-black text-lg flex items-center justify-center mb-4">
                      0{step.stepNumber}
                    </span>

                    <h3 className="font-bold text-lg text-white mb-2 break-words">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 sm:mt-12 text-center">
              <Link
                href="/custom-order"
                className="inline-block bg-[#F28C28] text-[#111111] hover:bg-white hover:text-[#123B5D] font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded shadow-lg transition-all min-h-[44px]"
              >
                Start Your Custom Order
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Why Choose nagarments */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold text-[#F28C28] uppercase tracking-widest block mb-1">
              Uncompromised Quality
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#123B5D] break-words">
              What You Can Expect From Us
            </h2>

            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              We focus on good fit, careful finishing, dependable service, and clothing made for real needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((pillar) => (
              <div
                key={pillar.id}
                className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm space-y-3 min-w-0"
              >
                <div className="w-10 h-10 rounded bg-[#EEF3F6] text-[#123B5D] font-bold flex items-center justify-center text-lg">
                  ✓
                </div>

                <h3 className="font-bold text-base text-[#123B5D] break-words">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. About / Brand Introduction */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center shadow-sm min-w-0">
            <div className="lg:col-span-7 space-y-4 min-w-0">
              <span className="text-xs font-bold text-[#F28C28] uppercase tracking-widest block">
                About nagarments
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B5D] break-words">
                Clothing Made in Kigali, Serving Beyond Rwanda
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                nagarments is based in Kagugu, Batsinda, near Batsinda Bus Park in Kigali. We make school uniforms, workwear, men’s clothing, ready-to-wear pieces, and clothing made
                to order for individuals, schools, and businesses.
              </p>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
               Whether you need a few pieces or clothing for a team, we serve customers across Rwanda and beyond, helping individuals, schools,
               and businesses meet their clothing needs.
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center text-xs font-bold text-[#123B5D] hover:text-[#F28C28] transition-colors"
                >
                  Read Full Brand Story &rarr;
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#EEF3F6] p-5 sm:p-6 rounded-lg border border-gray-200 text-center space-y-3 min-w-0">
              <h3 className="font-bold text-base text-[#123B5D] break-words">
                Ordering for a School or Business?
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed">
                We offer custom quotes and fabric samples for schools, security organizations, and corporate teams in Rwanda and beyond.
              </p>

              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-block bg-[#123B5D] text-white hover:bg-[#F28C28] hover:text-[#111111] font-bold text-xs uppercase px-5 py-2.5 rounded transition-colors max-w-full break-words"
              >
                Call: {CONTACT_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </section>

        {/* 8. Contact CTA Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-[#111111] text-white rounded-lg p-5 sm:p-8 lg:p-12 text-center space-y-6 border-2 border-[#F28C28]">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight break-words">
              Let’s Talk About Your Order
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
              Tell us what you need, and our team will help you choose the right option or plan
               a made-to-order garment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-[#F28C28] text-[#111111] hover:bg-white hover:text-[#123B5D] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded transition-colors min-h-[44px] flex items-center justify-center"
              >
                Contact Atelier
              </Link>

              <a
                href={CONTACT_INFO.emailHref}
                className="w-full sm:w-auto bg-transparent border border-white text-white hover:bg-white hover:text-[#111111] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded transition-colors min-h-[44px] flex items-center justify-center"
              >
                Email Inquiry
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}