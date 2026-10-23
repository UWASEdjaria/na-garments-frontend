'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  COUNTRY_TO_CURRENCY,
  CURRENCY_MANUAL_KEY,
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
  type CurrencyConfig,
  type CountryCurrency,
} from '../lib/currency.config';
import { api } from '../lib/api';
import {
  fetchExchangeRates,
  getRateForCurrency,
} from '../lib/exchange-rate.service';
import { formatPrice } from '../lib/currency.utils';

interface CurrencyContextValue {
  currency: CurrencyConfig;
  countries: CountryCurrency[];
  rate: number;
  setCurrency: (code: string) => void;
  format: (rwfAmount: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

async function detectCountryCode(): Promise<string | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      country_code?: string;
    };

    return data.country_code ?? null;
  } catch {
    return null;
  }
}

export function CurrencyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY);
  const [countries, setCountries] = useState<CountryCurrency[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({
    RWF: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const exchangeRates = await fetchExchangeRates();

        if (cancelled) return;

        setRates(exchangeRates);

        let countryList: CountryCurrency[] = [];

        try {
          const response = await api.get<CountryCurrency[]>(
            '/currency/countries',
          );

          if (Array.isArray(response.data)) {
            countryList = response.data;
          }
        } catch {
          // Keep the app usable if the country endpoint is unavailable.
        }

        if (cancelled) return;

        setCountries(countryList);

        const isAvailable = (code: string) =>
          Boolean(
            SUPPORTED_CURRENCIES[code] ||
            exchangeRates[code] !== undefined,
          );

        // A manually selected currency takes priority.
        const manual = localStorage.getItem(CURRENCY_MANUAL_KEY);

        if (manual && isAvailable(manual)) {
          setCurrencyCode(manual);
          return;
        }

        // Otherwise, restore the previously selected currency.
        const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);

        if (saved && isAvailable(saved)) {
          setCurrencyCode(saved);
          return;
        }

        // Suggest the currency associated with the detected country.
        const detectedCountry = await detectCountryCode();

        if (cancelled) return;

        const countryMatch = countryList.find(
          (country) => country.countryCode === detectedCountry,
        );

        const suggested =
          countryMatch?.currencyCode ??
          (detectedCountry
            ? COUNTRY_TO_CURRENCY[detectedCountry]
            : undefined) ??
          DEFAULT_CURRENCY;

        const selected = isAvailable(suggested)
          ? suggested
          : DEFAULT_CURRENCY;

        setCurrencyCode(selected);
        localStorage.setItem(CURRENCY_STORAGE_KEY, selected);
      } catch {
        // Preserve the default currency if initialization fails.
        if (!cancelled) {
          setCurrencyCode(DEFAULT_CURRENCY);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback(
    (code: string) => {
      const available =
        Boolean(SUPPORTED_CURRENCIES[code]) ||
        rates[code] !== undefined;

      if (!available) return;

      setCurrencyCode(code);
      localStorage.setItem(CURRENCY_MANUAL_KEY, code);
      localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    },
    [rates],
  );

  const rate = getRateForCurrency(rates, currencyCode);

  const selectedCountry = countries.find(
    (country) => country.currencyCode === currencyCode,
  );

  const currency: CurrencyConfig =
    SUPPORTED_CURRENCIES[currencyCode] ?? {
      code: currencyCode,
      symbol: currencyCode,
      name: currencyCode,
      locale: 'en-US',
    };

  const format = useCallback(
    (rwfAmount: number) =>
      formatPrice(rwfAmount, currencyCode, rate),
    [currencyCode, rate],
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        countries,
        rate,
        setCurrency,
        format,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error(
      'useCurrency must be used inside CurrencyProvider',
    );
  }

  return context;
}
