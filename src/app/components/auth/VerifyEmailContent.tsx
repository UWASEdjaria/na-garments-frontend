'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
FiCheckCircle,
FiAlertCircle,
FiLoader,
FiMail,
} from 'react-icons/fi';
import Navbar from '@/app/components/Navbar';
import { authService } from '@/app/services/auth.service';



type VerificationStatus = 'loading' | 'success' | 'error';



export default function VerifyEmailContent() {
const searchParams = useSearchParams();
const token = searchParams.get('token');



const [status, setStatus] = useState<VerificationStatus>('loading');
const [message, setMessage] = useState(
'Verifying your email address...'
);



useEffect(() => {
if (!token) {
setStatus('error');
setMessage(
'The verification link is missing its token. Please check your email.'
);
return;
}

let active = true;

const verifyEmail = async () => {
  try {
    const response = await authService.verifyEmail(token);

    if (active) {
      setStatus('success');
      setMessage(response.message);
    }
  } catch {
    if (active) {
      setStatus('error');
      setMessage(
        'This verification link is invalid or has expired. Please request a new one.'
      );
    }
  }
};

void verifyEmail();

return () => {
  active = false;
};


}, [token]);



return (


<div className="flex min-h-screen flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />
  <main className="flex flex-1 items-center justify-center px-4 py-10">
    <section className="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-xl sm:p-10">
      <p className="text-xs font-bold tracking-[0.2em] text-[#F28C28]">
        nagarments
      </p>

      <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF3F6]">
        {status === 'loading' && (
          <FiLoader className="h-8 w-8 animate-spin text-[#123B5D]" />
        )}

        {status === 'success' && (
          <FiCheckCircle className="h-8 w-8 text-green-600" />
        )}

        {status === 'error' && (
          <FiAlertCircle className="h-8 w-8 text-red-600" />
        )}
      </div>

      <h1 className="mt-5 text-2xl font-extrabold text-[#123B5D] sm:text-3xl">
        {status === 'loading'
          ? 'Verifying Your Email'
          : status === 'success'
            ? 'Email Verified!'
            : 'Verification Failed'}
      </h1>

      <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
        {message}
      </p>

      {status === 'success' && (
        <Link
          href="/auth/login"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B5D] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0d2f4a]"
        >
          <FiMail />
          Sign In
        </Link>
      )}

      {status === 'error' && (
        <Link
          href="/auth/login"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#123B5D] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0d2f4a]"
        >
          Back to Sign In
        </Link>
      )}

      {status === 'loading' && (
        <p className="mt-5 text-xs text-gray-500">
          Please wait while we confirm your email address.
        </p>
      )}
    </section>
  </main>
</div>


);
}