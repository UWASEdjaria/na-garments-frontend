'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/app/lib/api';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

type CustomerQuote = {
  quoteReference: string | null;
  garmentType: string;
  quantity: number;
  quoteTotal: number | null;
  advanceAmount: number | null;
  deliveryFee: number | null;
  additionalCharges: number | null;
  balanceAmount: number | null;
  estimatedCompletionAt: string | null;
  paymentTerms: string | null;
  quoteStatus: string;
};

type QuoteDecision = {
  quoteReference: string | null;
  quoteStatus: string;
};

function formatRwf(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return 'Not provided';

  return `${new Intl.NumberFormat('en-RW', {
    maximumFractionDigits: 0,
  }).format(value)} RWF`;
}

function formatDate(value: string | null): string {
  if (!value) return 'Not provided';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not provided';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = error.response;
    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response
    ) {
      const data = response.data;
      if (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string'
      ) {
        return data.message;
      }
    }
  }

  return fallback;
}

export default function CustomerQuotePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [quote, setQuote] = useState<CustomerQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [decisionMessage, setDecisionMessage] = useState('');
  const [decisionStatus, setDecisionStatus] = useState('');
  const [pendingDecision, setPendingDecision] = useState<boolean | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadQuote() {
      setLoading(true);
      setErrorMessage('');

      try {
        const response = await api.get<CustomerQuote>(
          `/custom-orders/quote/${encodeURIComponent(token)}`
        );

        if (active) setQuote(response.data);
      } catch (error: unknown) {
        if (active) {
          setErrorMessage(
            getErrorMessage(
              error,
              'This quote link is invalid, expired, or no longer available.'
            )
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (token) {
      void loadQuote();
    } else {
      setErrorMessage('The quote link is missing its secure token.');
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [token]);

  async function submitDecision(accepted: boolean) {
    if (!token || submitting || !quote || quote.quoteStatus !== 'PROPOSED') {
      return;
    }


    setSubmitting(true);
    setErrorMessage('');
    setDecisionMessage('');

    try {
      const response = await api.post<QuoteDecision>(
        `/custom-orders/quote/${encodeURIComponent(token)}/decision`,
        { accepted }
      );

      const result = response.data;
      setDecisionStatus(result.quoteStatus);
      setPendingDecision(null);
      setQuote((current) =>
        current ? { ...current, quoteStatus: result.quoteStatus } : current
      );
      const message =
        result.quoteStatus === 'ACCEPTED'
          ? 'You accepted this quote. Nagarments can now follow up about the next steps. No payment has been made through this page.'
          : 'You declined this quote. Contact Nagarments if you would like to discuss another option.';
      setDecisionMessage(message);
      setToast({ type: 'success', message });
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        'We could not record your decision. The quote may have expired or already been decided.'
      );
      setErrorMessage(message);
      setToast({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  }

  const canDecide = quote?.quoteStatus === 'PROPOSED' && !decisionStatus;

  return (
    <div className="flex min-h-screen flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />

      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-lg sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            nagarments
          </p>

          <h1 className="mt-2 text-2xl font-extrabold text-[#123B5D] sm:text-3xl">
            Your custom clothing quote
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Review your quote carefully before making your decision.
          </p>

          {loading && (
            <p className="mt-8 rounded-lg bg-[#EEF3F6] p-4 text-sm" role="status">
              Loading your quote…
            </p>
          )}

          {!loading && errorMessage && !quote && (
            <div
              className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
              role="alert"
            >
              {errorMessage}
              <p className="mt-2">
                If you believe this link should still work, please contact Nagarments.
              </p>
            </div>
          )}

          {!loading && quote && (
            <>
              <div className="mt-6 rounded-xl bg-[#123B5D] p-5 text-white">
                <p className="text-sm text-white/75">Quote reference</p>
                <p className="mt-1 break-words text-lg font-bold">
                  {quote.quoteReference || 'Pending reference'}
                </p>

                <p className="mt-5 text-sm text-white/75">Total quote price</p>
                <p className="mt-1 text-3xl font-extrabold">
                  {formatRwf(quote.quoteTotal)}
                </p>
                <p className="mt-2 text-xs text-white/75">
                  The total includes the listed delivery fee and additional charges.
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-bold text-[#123B5D]">
                  Order details
                </h2>

                <dl className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200 px-4">
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-sm text-gray-600">Garment</dt>
                    <dd className="text-right text-sm font-semibold">
                      {quote.garmentType}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-sm text-gray-600">Quantity</dt>
                    <dd className="text-right text-sm font-semibold">
                      {quote.quantity}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-sm text-gray-600">Delivery fee</dt>
                    <dd className="text-right text-sm font-semibold">
                      {formatRwf(quote.deliveryFee)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-sm text-gray-600">Additional charges</dt>
                    <dd className="text-right text-sm font-semibold">
                      {formatRwf(quote.additionalCharges)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-sm text-gray-600">Advance requested</dt>
                    <dd className="text-right text-sm font-semibold">
                      {formatRwf(quote.advanceAmount)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-sm text-gray-600">Remaining balance</dt>
                    <dd className="text-right text-sm font-bold text-[#123B5D]">
                      {formatRwf(quote.balanceAmount)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-sm text-gray-600">Estimated completion</dt>
                    <dd className="text-right text-sm font-semibold">
                      {formatDate(quote.estimatedCompletionAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-5 rounded-xl border border-[#123B5D]/15 bg-[#EEF3F6] p-4">
                <h2 className="font-bold text-[#123B5D]">Payment terms</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {quote.paymentTerms || 'Please contact Nagarments for payment terms.'}
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                Accepting a quote confirms your decision only. It does not make a
                payment or mark the order as paid.
              </p>

              {errorMessage && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {errorMessage}
                </p>
              )}

              {decisionMessage && (
                <p className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900" role="status">
                  {decisionMessage}
                </p>
              )}

              {!canDecide && !decisionMessage && (
                <p className="mt-5 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                  This quote is no longer awaiting a decision.
                  {quote.quoteStatus ? ` Status: ${quote.quoteStatus}.` : ''}
                </p>
              )}

              {canDecide && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setPendingDecision(true)}
                    disabled={submitting}
                    className="min-h-12 flex-1 rounded-lg bg-[#123B5D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d2d47] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Submitting…' : 'Accept quote'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDecision(false)}
                    disabled={submitting}
                    className="min-h-12 flex-1 rounded-lg border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Decline quote
                  </button>
                </div>
              )}

              <p className="mt-6 text-center text-sm text-gray-600">
                Need to discuss your quote?{' '}
                <Link
                  href="/contact"
                  className="font-bold text-[#123B5D] underline underline-offset-4"
                >
                  Contact Nagarments
                </Link>
              </p>
            </>
          )}
        </section>
      </main>

      <Footer />

      {pendingDecision !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation">
          <section
            aria-labelledby="quote-confirm-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-[#F28C28]">nagarments</p>
            <h2 id="quote-confirm-title" className="mt-2 text-xl font-extrabold text-[#123B5D]">
              {pendingDecision ? 'Accept this quote?' : 'Decline this quote?'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {pendingDecision
                ? 'Please confirm that you want to accept this custom clothing quote.'
                : 'Are you sure you want to decline this custom clothing quote?'}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setPendingDecision(null)}
                className="min-h-11 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void submitDecision(pendingDecision)}
                className="min-h-11 flex-1 rounded-lg bg-[#123B5D] px-4 py-3 text-sm font-bold text-white hover:bg-[#0d2d47] disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : pendingDecision ? 'Yes, accept' : 'Yes, decline'}
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div
          className={`fixed right-4 top-4 z-[60] flex max-w-sm items-start gap-3 rounded-xl border p-4 shadow-xl ${
            toast.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-900'
              : 'border-red-200 bg-red-50 text-red-900'
          }`}
          role={toast.type === 'error' ? 'alert' : 'status'}
        >
          <span className="font-bold">{toast.type === 'success' ? 'Success' : 'Error'}</span>
          <p className="flex-1 text-sm">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
            className="font-bold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
