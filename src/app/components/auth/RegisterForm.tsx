'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
} from 'react-icons/fi';
import { z } from 'zod';

import useAuth from '@/app/hooks/useAuth';
import { registerSchema } from '@/app/lib/validations/auth.schema';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
   const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage('');

    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const successMessage = `Welcome to NA-GARMENTS, ${response.data.user.name}! Your account has been created successfully. Please sign in to continue.`;

      sessionStorage.setItem('registerSuccess', successMessage);
      router.push('/auth/login');
    } catch (error) {
      console.error('Registration failed:', error);

      setErrorMessage(
        'Unable to create your account. Please check your information and try again.'
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28C28]">
          NA-GARMENTS
        </p>

        <h1 className="mt-1.5 text-2xl font-extrabold text-[#123B5D] sm:text-3xl">
          Create Your Account
        </h1>

        <p className="mt-1.5 text-sm text-gray-600">
          Create an account to manage your orders and enjoy a better shopping
          experience.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
        noValidate
      >
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-semibold text-[#111111]"
          >
            Full Name
          </label>

          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#123B5D] focus:ring-2 focus:ring-[#123B5D]/10"
            />
          </div>

          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-semibold text-[#111111]"
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
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#123B5D] focus:ring-2 focus:ring-[#123B5D]/10"
            />
          </div>

          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-semibold text-[#111111]"
          >
            Phone <span className="font-normal text-gray-500">(optional)</span>
          </label>

          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+250 7XX XXX XXX"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              {...register('phone')}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#123B5D] focus:ring-2 focus:ring-[#123B5D]/10"
            />
          </div>

          {errors.phone && (
            <p id="phone-error" className="mt-1 text-xs text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-semibold text-[#111111]"
          >
            Password
          </label>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? 'password-error' : undefined
              }
              {...register('password')}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-12 text-sm outline-none transition focus:border-[#123B5D] focus:ring-2 focus:ring-[#123B5D]/10"
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-semibold text-[#111111]"
          >
            Confirm Password
          </label>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirm your password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? 'confirm-password-error'
                  : undefined
              }
              {...register('confirmPassword')}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-12 text-sm outline-none transition focus:border-[#123B5D] focus:ring-2 focus:ring-[#123B5D]/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
              aria-pressed={showConfirmPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#F28C28]"
            >
              {showConfirmPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              className="mt-1 text-xs text-red-600"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#123B5D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2f4a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
          {!isSubmitting && <FiArrowRight />}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
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