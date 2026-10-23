import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from './currency.config';



export function formatPrice(
rwfAmount: number,
currencyCode: string,
rate: number,
): string {
const config =
SUPPORTED_CURRENCIES[currencyCode] ??
SUPPORTED_CURRENCIES[DEFAULT_CURRENCY];



if (!Number.isFinite(rwfAmount)) {
return 'Price unavailable';
}



if (config.code !== 'RWF' && (!Number.isFinite(rate) || rate <= 0)) {
return 'Price unavailable';
}



const converted =
config.code === 'RWF' ? rwfAmount : rwfAmount * rate;



if (!Number.isFinite(converted)) {
return 'Price unavailable';
}



return new Intl.NumberFormat(config.locale, {
style: 'currency',
currency: config.code,
}).format(converted);
}