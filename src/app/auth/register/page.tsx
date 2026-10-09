import Image from 'next/image';
import Link from 'next/link';

import RegisterForm from '@/app/components/auth/RegisterForm';
import Navbar from '@/app/components/Navbar';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />

      <main className="flex flex-1">
        <div className="mx-auto flex w-full max-w-7xl flex-1 px-3 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-4">
          <div className="grid w-full flex-1 overflow-hidden rounded-2xl bg-white shadow-xl lg:min-h-[calc(100vh-140px)] lg:grid-cols-2">
            {/* Register Form */}
            <section className="flex items-center justify-center px-3 py-3 sm:px-5 sm:py-4 lg:px-7 lg:py-5">
              <div className="w-full max-w-md">
                <RegisterForm />

                <div className="mt-2 text-center">
                  <Link
                    href="/"
                    className="text-sm font-semibold text-[#123B5D] transition-colors hover:text-[#F28C28]"
                  >
                    ← Back to home
                  </Link>
                </div>
              </div>
            </section>

            {/* Tailoring Image */}
            <section className="relative min-h-[220px] overflow-hidden lg:min-h-0">
              <Image
                src="https://res.cloudinary.com/ziwgo9pj/image/upload/v1791484189/aldward-castillo-80wCvkB8w0Q-unsplash.jpg"
                alt="Sewing machine, thread and measuring tape in a tailoring workshop"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                unoptimized
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#123B5D]/95 via-[#123B5D]/80 to-[#111111]/25" />

              <div className="relative z-10 flex h-full items-end p-5 text-white sm:p-7 lg:p-8">
                <div className="max-w-lg">
                  <p className="mb-2 text-xs font-bold tracking-[0.25em] text-[#F28C28]">
                    nagarments
                  </p>

                  <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
                    Crafted to Fit. Made with Care.
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[#EEF3F6]/90 sm:text-base">
                    Quality tailoring and fashion made for you in Kigali,
                    Rwanda.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      Custom Tailoring
                    </span>

                    <span className="rounded bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      Quality Apparel
                    </span>

                    <span className="rounded bg-[#F28C28] px-3 py-1.5 text-xs font-bold text-[#111111]">
                      Kigali
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}