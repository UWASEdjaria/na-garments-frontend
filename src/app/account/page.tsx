'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';

import Navbar from '@/app/components/Navbar';
import useAuth from '@/app/hooks/useAuth';

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [isLoading, router, user]);

  return (
    <div className="flex min-h-screen flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
        {isLoading || !user ? (
          <p className="text-sm text-gray-600" role="status">
            Loading account...
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-[#123B5D] sm:text-3xl">
                  My Account
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Your nagarments profile
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.replace('/auth/login');
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-[#123B5D] transition hover:border-[#F28C28] hover:text-[#F28C28]"
              >
                <FiLogOut aria-hidden="true" />
                Sign out
              </button>
            </div>

            <section className="mt-8 border-y border-gray-300 bg-white px-5 py-2 sm:px-7">
              <dl className="divide-y divide-gray-200">
                <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4">
                  <dt className="text-sm font-semibold text-gray-600">Name</dt>
                  <dd className="text-sm font-medium text-[#111111]">
                    {user.name}
                  </dd>
                </div>
                <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4">
                  <dt className="text-sm font-semibold text-gray-600">Email</dt>
                  <dd className="break-all text-sm font-medium text-[#111111]">
                    {user.email}
                  </dd>
                </div>
                <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4">
                  <dt className="text-sm font-semibold text-gray-600">Phone</dt>
                  <dd className="text-sm font-medium text-[#111111]">
                    {user.phone || 'Not provided'}
                  </dd>
                </div>
              </dl>
            </section>
          </>
        )}
      </main>
    </div>
  );
}