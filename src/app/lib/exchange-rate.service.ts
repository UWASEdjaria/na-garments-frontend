import { api } from './api';
import { BASE_CURRENCY } from './currency.config';



const CACHE_TTL_MS = 60 * 60 * 1000;



interface ExchangeRateResponse {
baseCurrency: string;
rates: Record<string, number>;
source: 'live' | 'fallback';
}



let cachedRates: {
rates: Record<string, number>;
fetchedAt: number;
} | null = null;



export async function fetchExchangeRates(): Promise<Record<string, number>> {
const now = Date.now();



if (cachedRates && now - cachedRates.fetchedAt < CACHE_TTL_MS) {
return cachedRates.rates;
}



try {
const response = await api.get('/currency/rates');
const data = response.data;

if (
  data.baseCurrency !== BASE_CURRENCY ||
  !data.rates ||
  typeof data.rates.RWF !== 'number'
) {
  throw new Error('Invalid exchange-rate response');
}
const rates: Record<string, number> = {};

for (const [code, rate] of Object.entries(data.rates)) {
  if (
    typeof rate === 'number' &&
    Number.isFinite(rate) &&
    rate > 0
  ) {
    rates[code] = rate;
  }
}
rates.RWF = 1;

cachedRates = {
  rates,
  fetchedAt: now,
};

return rates;


} catch (error) {
console.error('Unable to fetch exchange rates from the backend:', error);

return {
  RWF: 1,
};


}
}



export function getRateForCurrency(
rates: Record<string, number>,
code: string,
): number {
if (code === BASE_CURRENCY) {
return 1;
}



const rate = rates[code];



if (
typeof rate !== 'number' ||
!Number.isFinite(rate) ||
rate <= 0
) {
return 0;
}



return rate;
}