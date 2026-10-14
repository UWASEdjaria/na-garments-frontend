export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  RWF: { code: 'RWF', symbol: 'RWF', name: 'Rwandan Franc', locale: 'rw-RW' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG' },
};

// ISO 3166-1 alpha-2 → currency code
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  RW: 'RWF',
  US: 'USD',
  NG: 'NGN',
};

export const DEFAULT_CURRENCY = 'RWF';
export const BASE_CURRENCY = 'RWF';
export const CURRENCY_STORAGE_KEY = 'na_garments_currency';
export const CURRENCY_MANUAL_KEY = 'na_garments_currency_manual';
