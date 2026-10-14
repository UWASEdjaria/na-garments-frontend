import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from './currency.config';

export function formatPrice(rwfAmount: number, currencyCode: string, rate: number): string {
  const config = SUPPORTED_CURRENCIES[currencyCode] ?? SUPPORTED_CURRENCIES[DEFAULT_CURRENCY];
  const converted = currencyCode === 'RWF' ? rwfAmount : rwfAmount * rate;

  if (currencyCode === 'RWF') {
    return `${Math.round(converted).toLocaleString('en-RW')} RWF`;
  }

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}
