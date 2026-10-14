'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import useAuth from '@/app/hooks/useAuth';

export default function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') router.replace('/auth/login');
  }, [isLoading, router, user]);

  if (isLoading || user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm font-medium text-[#123B5D]" role="status">
        Checking administrator access...
      </div>
    );
  }

  return children;
}