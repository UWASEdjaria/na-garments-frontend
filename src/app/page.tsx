import FadeIn from '@/app/components/animations/FadeIn';
import SlideUp from '@/app/components/animations/SlideUp';
import MarqueeText from '@/app/components/animations/MarqueeText';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoginSuccessNotice from '@/app/components/auth/LoginSuccessNotice';
import { CONTACT_INFO, TAILORING_STEPS, WHY_CHOOSE_US } from './lib/constants';
import FeaturedProducts from './components/FeaturedProducts';
import FeaturedCategories from './components/FeaturedCategories';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#EEF3F6] text-[#111111]">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <LoginSuccessNotice />
      </div>

      <main className="flex-grow space-y-8 pb-10 sm:space-y-10 sm:pb-12 lg:space-y-12 lg:pb-16">
        {/* 1. Hero Section */}
        <section className="relative flex min-h-0 items-center overflow-hidden border-b-4 border-[#F28C28] bg-[#111111] px-4 py-6 text-white sm:px-6 sm:py-8 lg:min-h-[60vh] lg:px-8 lg:py-10">
          {/* Video Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-[70%_center] sm:object-[70%_center] lg:object-[75%_center]"
            >
              <source
                src="https://res.cloudinary.com/ziwgo9pj/video/upload/v1791629286/726a4b679cfd2b76ff4e1c84aacd6b0e.mp4"
                type="video/mp4"
              />
            </video>

            {/* Brand-color overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#123B5D]/95 via-[#123B5D]/85 to-[#111111]/45 sm:from-[#123B5D]/95 sm:via-[#123B5D]/80 sm:to-[#111111]/30" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="max-w-2xl space-y-3 text-center sm:space-y-4 sm:text-left">
              <FadeIn>
                <span className="inline-block rounded bg-[#F28C28] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#111111] sm:text-xs">
                  Precision Apparel & Bespoke Fitting
                </span>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="break-words text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                  Custom Tailoring & Quality Apparel in Kigali
                  <br className="hidden sm:inline" />{' '}
                  <span className="text-[#F28C28]">
                    Made to Fit Your Needs.
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mx-auto max-w-xl break-words text-xs leading-relaxed text-[#EEF3F6]/90 sm:mx-0 sm:text-sm md:text-base">
                  We make practical, well-fitted clothing for schools, workplaces,
                  businesses, and everyday wear, with options for both ready-made
                  and made-to-measure orders in Kigali.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-col items-center justify-center gap-2 pt-1 sm:flex-row sm:justify-start sm:gap-3 sm:pt-2">
                  <Link
                    href="/shop"
                    className="flex min-h-[44px] w-full items-center justify-center rounded bg-[#F28C28] px-5 py-2.5 text-center text-xs font-bold text-[#111111] shadow-md transition-all hover:bg-white hover:text-[#123B5D] sm:w-auto sm:text-sm"
                  >
                    Explore Collections
                  </Link>

                  <Link
                    href="/custom-order"
                    className="flex min-h-[44px] w-full items-center justify-center rounded border-2 border-white bg-transparent px-5 py-2.5 text-center text-xs font-bold text-white transition-all hover:bg-white hover:text-[#123B5D] sm:w-auto sm:text-sm"
                  >
                    Order Custom Garment
                  </Link>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                {/* Trust Badges */}
                <div className="mx-auto grid max-w-md grid-cols-1 gap-2 border-t border-white/20 pt-3 text-center text-[10px] text-[#EEF3F6]/80 min-[400px]:grid-cols-3 sm:mx-0 sm:gap-3 sm:text-xs">
                  <div>
                    <span className="block text-xs font-bold text-white sm:text-sm">
                      Custom orders
                    </span>
                    Made to Fit
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-white sm:text-sm">
                      Quality Fabrics
                    </span>
                    Selected with care
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-white sm:text-sm">
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
        <section className="border-y border-[#EEF3F6] bg-white py-2 sm:py-3">
          <MarqueeText duration={35}>
            <div className="flex items-center gap-8 px-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#123B5D] sm:text-sm">
                Custom Tailoring
              </span>
              <span className="text-[#F28C28]">•</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#123B5D] sm:text-sm">
                Ready-to-Wear
              </span>
              <span className="text-[#F28C28]">•</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#123B5D] sm:text-sm">
                Institutional Uniforms
              </span>
              <span className="text-[#F28C28]">•</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#123B5D] sm:text-sm">
                Industrial Workwear
              </span>
              <span className="text-[#F28C28]">•</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#123B5D] sm:text-sm">
                Men&apos;s Fashion
              </span>
              <span className="text-[#F28C28]">•</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#123B5D] sm:text-sm">
                Made to Measure
              </span>
              <span className="text-[#F28C28]">•</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#123B5D] sm:text-sm">
                Quality Craftsmanship
              </span>
              <span className="text-[#F28C28]">•</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#123B5D] sm:text-sm">
                Designed For You
              </span>
              <span className="text-[#F28C28]">•</span>
            </div>
          </MarqueeText>
        </section>

        {/* 3. Featured Categories */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8 lg:mb-10">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#F28C28] sm:text-xs">
                Garment Categories
              </span>

              <h2 className="break-words text-xl font-extrabold tracking-tight text-[#123B5D] sm:text-2xl md:text-3xl lg:text-4xl">
                Shop by Clothing Type
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
                Browse clothing for school, work, business, and everyday use,
                all in one place.
              </p>
            </div>
          </SlideUp>

          <FeaturedCategories />
        </section>

        {/* 4. Featured Products */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end">
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#F28C28] sm:text-xs">
                  Handcrafted Apparel
                </span>

                <h2 className="break-words text-xl font-extrabold tracking-tight text-[#123B5D] sm:text-2xl md:text-3xl lg:text-4xl">
                  Browse Popular Garments
                </h2>
              </div>

              <Link
                href="/shop"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#123B5D] transition-colors hover:text-[#F28C28] sm:text-sm"
              >
                View All Products &rarr;
              </Link>
            </div>
          </SlideUp>

          <FeaturedProducts />
        </section>

        {/* 5. Custom Tailoring CTA Section */}
        <section className="border-y-4 border-[#F28C28] bg-[#123B5D] py-8 text-white sm:py-10 lg:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#F28C28] sm:text-xs">
                From Choice to Fitting
              </span>

              <h2 className="break-words text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                How a Custom Order Works
              </h2>

              <p className="mt-3 text-xs leading-relaxed text-[#EEF3F6]/80 sm:text-sm md:text-base">
                From choosing your style to the final fitting, we guide you
                through a simple four-step process.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {TAILORING_STEPS.map((step) => (
                <div
                  key={step.stepNumber}
                  className="relative flex min-w-0 flex-col justify-between rounded-lg border border-white/10 bg-[#111111]/40 p-4 sm:p-6"
                >
                  <div>
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#F28C28] text-lg font-black text-[#111111]">
                      0{step.stepNumber}
                    </span>

                    <h3 className="mb-2 break-words text-base font-bold text-white sm:text-lg">
                      {step.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-gray-300 sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center sm:mt-10">
              <Link
                href="/custom-order"
                className="inline-flex min-h-[44px] items-center justify-center rounded bg-[#F28C28] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#111111] shadow-lg transition-all hover:bg-white hover:text-[#123B5D] sm:px-8 sm:text-sm"
              >
                Start Your Custom Order
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Why Choose nagarments */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8 lg:mb-10">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#F28C28] sm:text-xs">
                Uncompromised Quality
              </span>

              <h2 className="break-words text-xl font-extrabold text-[#123B5D] sm:text-2xl md:text-3xl lg:text-4xl">
                What You Can Expect From Us
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
                We focus on good fit, careful finishing, dependable service, and
                clothing made for real needs.
              </p>
            </div>
          </SlideUp>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((pillar) => (
              <div
                key={pillar.id}
                className="min-w-0 space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#EEF3F6] text-lg font-bold text-[#123B5D]">
                  ✓
                </div>

                <h3 className="break-words text-base font-bold text-[#123B5D]">
                  {pillar.title}
                </h3>

                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. About / Brand Introduction */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-w-0 grid-cols-1 items-center gap-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:gap-8 sm:p-8 lg:grid-cols-12 lg:p-12">
            <div className="min-w-0 space-y-4 lg:col-span-7">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#F28C28] sm:text-xs">
                About nagarments
              </span>

              <h2 className="break-words text-xl font-extrabold text-[#123B5D] sm:text-2xl lg:text-3xl">
                Clothing Made in Kigali, Serving Beyond Rwanda
              </h2>

              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                nagarments is based in Kagugu, Batsinda, near Batsinda Bus Park
                in Kigali. We make school uniforms, workwear, men&apos;s clothing,
                ready-to-wear pieces, and clothing made to order for individuals,
                schools, and businesses.
              </p>

              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                Whether you need a few pieces or clothing for a team, we serve
                customers across Rwanda and beyond, helping individuals, schools,
                and businesses meet their clothing needs.
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center text-xs font-bold text-[#123B5D] transition-colors hover:text-[#F28C28] sm:text-sm"
                >
                  Read Full Brand Story &rarr;
                </Link>
              </div>
            </div>

            <div className="min-w-0 space-y-3 rounded-lg border border-gray-200 bg-[#EEF3F6] p-4 text-center sm:p-6 lg:col-span-5">
              <h3 className="break-words text-base font-bold text-[#123B5D] sm:text-lg">
                Ordering for a School or Business?
              </h3>

              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                We offer custom quotes and fabric samples for schools, security
                organizations, and corporate teams in Rwanda and beyond.
              </p>

              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-block max-w-full break-words rounded bg-[#123B5D] px-5 py-2.5 text-xs font-bold uppercase text-white transition-colors hover:bg-[#F28C28] hover:text-[#111111]"
              >
                Call: {CONTACT_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </section>

        {/* 8. Contact CTA Banner */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 rounded-lg border-2 border-[#F28C28] bg-[#111111] p-4 text-center text-white sm:space-y-6 sm:p-8 lg:p-12">
            <h2 className="break-words text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
              Let&apos;s Talk About Your Order
            </h2>

            <p className="mx-auto max-w-xl text-xs leading-relaxed text-gray-300 sm:text-sm">
              Tell us what you need, and our team will help you choose the right
              option or plan a made-to-order garment.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/contact"
                className="flex min-h-[44px] w-full items-center justify-center rounded bg-[#F28C28] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#111111] transition-colors hover:bg-white hover:text-[#123B5D] sm:w-auto"
              >
                Contact Atelier
              </Link>

              <a
                href={CONTACT_INFO.emailHref}
                className="flex min-h-[44px] w-full items-center justify-center rounded border border-white bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#111111] sm:w-auto"
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
