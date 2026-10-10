'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  FiArrowRight,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiUser,
} from 'react-icons/fi';

import { contactService } from '@/app/services/contact.service';
import { CONTACT_INFO } from '@/app/lib/constants';
import {
  ContactFormValues,
  contactSchema,
} from '@/app/lib/validations/contact.schema';

export default function ContactForm() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await contactService.createMessage({
        names: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        subject: values.subject.trim(),
        message: values.message.trim(),
      });

      if (!response.success) {
        setErrorMessage(response.message || 'Your message could not be sent.');
        return;
      }

      setSuccessMessage(response.message);
      reset();
    } catch (error) {
      const serverMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;

      setErrorMessage(
        serverMessage ||
          'We could not send your message. Please try again or contact us by phone or email.'
      );
    }
  };

  const inputClassName =
    'w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-[#111111] outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20';
  const labelClassName = 'mb-1.5 block text-sm font-semibold text-[#111111]';

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28C28]">
          nagarments
        </p>
        <h1 className="mt-1.5 text-2xl font-extrabold text-[#123B5D] sm:text-3xl">
          Contact our atelier
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
          Questions about tailoring or apparel? Send us a message and our Kigali
          team will be in touch.
        </p>
      </div>

      <div className="mb-5 grid gap-2 border-y border-gray-100 py-4 text-sm sm:grid-cols-2">
        <a
          href={CONTACT_INFO.phoneHref}
          className="flex min-w-0 items-start gap-2 text-gray-600 transition hover:text-[#F28C28]"
        >
          <FiPhone className="mt-0.5 h-4 w-4 shrink-0 text-[#123B5D]" />
          <span>{CONTACT_INFO.phoneDisplay}</span>
        </a>
        <a
          href={CONTACT_INFO.emailHref}
          className="flex min-w-0 items-start gap-2 break-all text-gray-600 transition hover:text-[#F28C28]"
        >
          <FiMail className="mt-0.5 h-4 w-4 shrink-0 text-[#123B5D]" />
          <span>{CONTACT_INFO.emailDisplay}</span>
        </a>
        <a
          href={CONTACT_INFO.locationMapHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-start gap-2 text-gray-600 transition hover:text-[#F28C28] sm:col-span-2"
        >
          <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#123B5D]" />
          <span>Kagugu, Batsinda, near Batsinda Bus Park, Kigali, Rwanda</span>
        </a>
      </div>

      {successMessage && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:grid-cols-2" noValidate>
        <div>
          <label htmlFor="name" className={labelClassName}>
            Full name
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="name"
              autoComplete="name"
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
              className={inputClassName}
            />
          </div>
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email address
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
              className={inputClassName}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className={labelClassName}>
            Phone number <span className="font-normal text-gray-500">(optional)</span>
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
              className={inputClassName}
            />
          </div>
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-xs text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className={labelClassName}>
            Subject
          </label>
          <div className="relative">
            <FiMessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="subject"
              placeholder="How can we help?"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              {...register('subject')}
              className={inputClassName}
            />
          </div>
          {errors.subject && (
            <p id="subject-error" className="mt-1 text-xs text-red-600">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClassName}>
            Message
          </label>
          <textarea
            id="message"
            rows={3}
            placeholder="Tell us a little about what you need..."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            {...register('message')}
            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-gray-400 focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-xs text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#123B5D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F28C28] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
        >
          {isSubmitting ? 'Sending message...' : 'Send message'}
          {!isSubmitting && <FiArrowRight aria-hidden="true" />}
        </button>
      </form>
    </div>
  );
}