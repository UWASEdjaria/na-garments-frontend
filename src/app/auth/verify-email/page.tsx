import { Suspense } from 'react';
import VerifyEmailContent from '@/app/components/auth/VerifyEmailContent';


function VerifyEmailLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-100 p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-slate-600 font-medium text-sm">
          Loading email verification...
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}