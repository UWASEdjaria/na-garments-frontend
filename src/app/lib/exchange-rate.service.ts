import { BASE_CURRENCY } from './currency.config';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Approximate fallback rates (RWF base)
const FALLBACK_RATES: Record<string, number> = {
  RWF: 1,
  USD: 0.00073,
  NGN: 1.18,
};

let cachedRates: { rates: Record<string, number>; fetchedAt: number } | null = null;

export async function fetchExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();
  if (cachedRates && now - cachedRates.fetchedAt < CACHE_TTL_MS) {
    return cachedRates.rates;
  }

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${BASE_CURRENCY}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { result: string; rates: Record<string, number> };
    if (data.result !== 'success' || !data.rates) throw new Error('Bad response');
    cachedRates = { rates: data.rates, fetchedAt: now };
    return data.rates;
  } catch {
    return FALLBACK_RATES;
  }
}

export function getRateForCurrency(rates: Record<string, number>, code: string): number {
  if (code === BASE_CURRENCY) return 1;
  return rates[code] ?? 1;
}
