import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from './currency.config';

export function formatPrice(
  rwfAmount: number,
  currencyCode: string,
  rate: number,
): string {
  const config = SUPPORTED_CURRENCIES[currencyCode] ?? {
    code: currencyCode,
    symbol: currencyCode,
    name: currencyCode,
    locale: 'en',
  };

  const validAmount = Number.isFinite(rwfAmount) ? rwfAmount : 0;

  if (currencyCode === 'RWF') {
    return `${Math.round(validAmount).toLocaleString('en-RW')} RWF`;
  }

  if (!Number.isFinite(rate) || rate <= 0) {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(validAmount);
  }

  const converted = validAmount * rate;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}
