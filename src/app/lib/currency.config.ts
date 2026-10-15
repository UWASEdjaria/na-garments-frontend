import countryToCurrency from 'country-to-currency';



export interface CurrencyConfig {
code: string;
symbol: string;
name: string;
locale: string;
}



function createCurrencyConfig(code: string): CurrencyConfig {
const formatter = new Intl.NumberFormat('en', {
style: 'currency',
currency: code,
});



const symbol =
formatter.formatToParts(0).find((part) => part.type === 'currency')?.value ??
code;



const names = new Intl.DisplayNames(['en'], {
type: 'currency',
});



return {
code,
symbol,
name: names.of(code) ?? code,
locale: 'en',
};
}



const CURRENCY_CODES = [
...new Set(Object.values(countryToCurrency)),
];



export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> =
Object.fromEntries(
CURRENCY_CODES.map((code) => [code, createCurrencyConfig(code)]),
);



export const COUNTRY_TO_CURRENCY: Record<string, string> = countryToCurrency;



export const DEFAULT_CURRENCY = 'RWF';
export const BASE_CURRENCY = 'RWF';
export const CURRENCY_STORAGE_KEY = 'na_garments_currency';
export const CURRENCY_MANUAL_KEY = 'na_garments_currency_manual';