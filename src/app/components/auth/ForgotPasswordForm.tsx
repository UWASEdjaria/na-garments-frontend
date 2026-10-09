'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import { z } from 'zod';


import LoginSuccessMessage from './LoginSuccessMessage';
import { forgotPasswordSchema } from '@/app/lib/validations/auth.schema';
import { authService } from '@/app/services/auth.service';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await authService.forgotPassword({
        email: data.email,
      });

      setSuccessMessage(response.message);
    } catch (error) {
      console.error('Forgot password failed:', error);

      setErrorMessage(
        'Unable to process your request. Please check your email and try again.'
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-bold tracking-[0.2em] text-[#F28C28]">
          nagarments
        </p>

        <h1 className="mt-2 text-2xl font-extrabold text-[#123B5D] sm:text-3xl">
          Forgot Your Password?
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      {successMessage && (
  <div className="mb-4">
    <LoginSuccessMessage message={successMessage} />
  </div>
)}

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-semibold text-[#111111]"
          >
            Email
          </label>

          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#123B5D] focus:ring-2 focus:ring-[#123B5D]/10"
            />
          </div>

          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#123B5D] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2f4a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          {!isSubmitting && <FiArrowRight />}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link
          href="/auth/login"
          className="font-bold text-[#123B5D] transition-colors hover:text-[#F28C28]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}