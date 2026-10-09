'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { z } from 'zod';

import useAuth from '@/app/hooks/useAuth';
import { loginSchema } from '@/app/lib/validations/auth.schema';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage('');

    try {
      const response = await login(data);

      const successMessage = `Welcome back, ${response.data.user.name}! You have successfully signed in.`;

      sessionStorage.setItem('loginSuccess', successMessage);

     if (response.data.user.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Invalid email or password.');
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F28C28]">
          Welcome back
        </p>

        <h1 className="text-2xl font-extrabold text-[#111111] sm:text-3xl">
          Sign in to nagarments
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Sign in to manage your account and orders.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-[#111111]"
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
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
            />
          </div>

          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#111111]"
            >
              Password
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-xs font-semibold text-[#123B5D] transition hover:text-[#F28C28]"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? 'password-error' : undefined
              }
              {...register('password')}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-12 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#F28C28]"
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#123B5D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
          {!isSubmitting && <FiArrowRight />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/register"
          className="font-bold text-[#123B5D] transition hover:text-[#F28C28]"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}