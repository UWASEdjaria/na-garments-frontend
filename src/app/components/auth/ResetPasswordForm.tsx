'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiArrowRight, FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { z } from 'zod';

import { resetPasswordSchema } from '@/app/lib/validations/auth.schema';
import { authService } from '@/app/services/auth.service';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
const router = useRouter();
const searchParams = useSearchParams();
const token = searchParams.get('token') ?? '';

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');

const {
register,
handleSubmit,
formState: { errors },
} = useForm<ResetPasswordFormData>({
resolver: zodResolver(resetPasswordSchema),
defaultValues: {
token,
password: '',
confirmPassword: '',
},
});

const onSubmit = async (data: ResetPasswordFormData) => {
setIsSubmitting(true);
setSuccessMessage('');
setErrorMessage('');

try {
  const response = await authService.resetPassword({
    token,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });

  setSuccessMessage(response.message);

  setTimeout(() => {
    router.push('/auth/login?reset=success');
  }, 2000);
} catch (error) {
  console.error('Reset password failed:', error);
  setErrorMessage(
    'Unable to reset your password. The link may have expired. Please request a new one.'
  );
} finally {
  setIsSubmitting(false);
}


};

return ( <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"> <div className="mb-5"> <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28C28]">
NA-GARMENTS </p>

    <h1 className="mt-2 text-2xl font-extrabold text-[#123B5D] sm:text-3xl">
      Reset Your Password
    </h1>

    <p className="mt-2 text-sm leading-relaxed text-gray-600">
      Choose a new password for your account.
    </p>
  </div>

  {successMessage && (
    <div
      role="status"
      className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
    >
      {successMessage}
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

  {!token ? (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      This password reset link is missing its token. Please request a new
      reset link.
    </div>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('token')} />

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-semibold text-[#111111]"
        >
          New Password
        </label>

        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            autoComplete="new-password"
            {...register('password')}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 text-sm outline-none transition focus:border-[#123B5D] focus:ring-2 focus:ring-[#123B5D]/10"
            aria-invalid={Boolean(errors.password)}
          />

          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#123B5D]"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-sm font-semibold text-[#111111]"
        >
          Confirm New Password
        </label>

        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 text-sm outline-none transition focus:border-[#123B5D] focus:ring-2 focus:ring-[#123B5D]/10"
            aria-invalid={Boolean(errors.confirmPassword)}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((visible) => !visible)
            }
            aria-label={
              showConfirmPassword
                ? 'Hide confirm password'
                : 'Show confirm password'
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#123B5D]"
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || Boolean(successMessage)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#123B5D] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2f4a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
        {!isSubmitting && <FiArrowRight />}
      </button>
    </form>
  )}

  <p className="mt-5 text-center text-sm text-gray-600">
    Remember your password?{' '}
    <a
      href="/auth/login"
      className="font-bold text-[#123B5D] transition-colors hover:text-[#F28C28]"
    >
      Sign in
    </a>
  </p>
</div>


);
}
