'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  COUNTRY_TO_CURRENCY, CURRENCY_MANUAL_KEY, CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY, SUPPORTED_CURRENCIES, type CurrencyConfig,
} from '../lib/currency.config';
import { fetchExchangeRates, getRateForCurrency } from '../lib/exchange-rate.service';
import { formatPrice } from '../lib/currency.utils';

interface CurrencyContextValue {
  currency: CurrencyConfig;
  rate: number;
  setCurrency: (code: string) => void;
  format: (rwfAmount: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

async function detectCountryCode(): Promise<string | null> {
  try {
    const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as { country_code?: string };
    return data.country_code ?? null;
  } catch {
    return null;
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY);
  const [rates, setRates] = useState<Record<string, number>>({ RWF: 1 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const exchangeRates = await fetchExchangeRates();
      setRates(exchangeRates);

      // Manual preference wins — never override it
      const manual = localStorage.getItem(CURRENCY_MANUAL_KEY);
      if (manual && SUPPORTED_CURRENCIES[manual]) {
        setCurrencyCode(manual);
        setIsLoading(false);
        return;
      }

      // Previously auto-detected preference
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved && SUPPORTED_CURRENCIES[saved]) {
        setCurrencyCode(saved);
        setIsLoading(false);
        return;
      }

      // Detect country and suggest currency
      const country = await detectCountryCode();
      const suggested = country ? (COUNTRY_TO_CURRENCY[country] ?? DEFAULT_CURRENCY) : DEFAULT_CURRENCY;
      setCurrencyCode(suggested);
      localStorage.setItem(CURRENCY_STORAGE_KEY, suggested);
      setIsLoading(false);
    }
    void init();
  }, []);

  const setCurrency = useCallback((code: string) => {
    if (!SUPPORTED_CURRENCIES[code]) return;
    setCurrencyCode(code);
    localStorage.setItem(CURRENCY_MANUAL_KEY, code);
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  }, []);

  const rate = getRateForCurrency(rates, currencyCode);
  const currency = SUPPORTED_CURRENCIES[currencyCode] ?? SUPPORTED_CURRENCIES[DEFAULT_CURRENCY];
  const format = useCallback((rwf: number) => formatPrice(rwf, currencyCode, rate), [currencyCode, rate]);

  return (
    <CurrencyContext.Provider value={{ currency, rate, setCurrency, format, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}
