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
CURRENCY_MANUAL_KEY,
CURRENCY_STORAGE_KEY,
DEFAULT_CURRENCY,
SUPPORTED_CURRENCIES,
type CurrencyConfig,
} from '../lib/currency.config';
import {
fetchCountries,
type CountryOption,
} from '../lib/country.service';
import {
fetchExchangeRates,
getRateForCurrency,
} from '../lib/exchange-rate.service';
import { formatPrice } from '../lib/currency.utils';



const COUNTRY_STORAGE_KEY = 'nagarments_country';
const MANUAL_COUNTRY_KEY = 'nagarments_manual_country';



interface CurrencyContextValue {
currency: CurrencyConfig;
rate: number;
availableCurrencies: CurrencyConfig[];
availableCountries: CountryOption[];
selectedCountry: CountryOption | null;
setCurrency: (code: string) => void;
setCountry: (countryCode: string) => void;
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

return data.country_code?.toUpperCase() ?? null;


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
const [countries, setCountries] = useState<CountryOption[]>([]);
const [selectedCountryCode, setSelectedCountryCode] = useState('RW');
const [rates, setRates] = useState<Record<string, number>>({
RWF: 1,
});
const [isLoading, setIsLoading] = useState(true);



useEffect(() => {
let cancelled = false;

async function initializeCurrency() {
  try {
    const [exchangeRates, countryList] = await Promise.all([
      fetchExchangeRates(),
      fetchCountries(),
    ]);

    if (cancelled) return;

    setRates(exchangeRates);
    setCountries(countryList);

    const availableCountries = countryList.filter(
      (country) =>
        country.currencyCode === DEFAULT_CURRENCY ||
        (SUPPORTED_CURRENCIES[country.currencyCode] &&
          typeof exchangeRates[country.currencyCode] === 'number' &&
          Number.isFinite(exchangeRates[country.currencyCode]) &&
          exchangeRates[country.currencyCode] > 0),
    );

    const manualCountryCode = localStorage.getItem(
      MANUAL_COUNTRY_KEY,
    );

    const savedCountryCode = localStorage.getItem(
      COUNTRY_STORAGE_KEY,
    );

    const manualCurrencyCode = localStorage.getItem(
      CURRENCY_MANUAL_KEY,
    );

    const savedCurrencyCode = localStorage.getItem(
      CURRENCY_STORAGE_KEY,
    );

    let chosenCountry =
      availableCountries.find(
        (country) => country.countryCode === manualCountryCode,
      ) ?? null;

    // Respect a previously selected currency if no manual country exists.
    if (!chosenCountry && !manualCountryCode && manualCurrencyCode) {
      chosenCountry =
        availableCountries.find(
          (country) => country.currencyCode === manualCurrencyCode,
        ) ?? null;
    }

    // Restore the previous country before detecting a new one.
    if (!chosenCountry && savedCountryCode) {
      chosenCountry =
        availableCountries.find(
          (country) => country.countryCode === savedCountryCode,
        ) ?? null;
    }

    // Automatically detect the visitor's country when no preference exists.
    if (!chosenCountry && !manualCountryCode && !manualCurrencyCode) {
      const detectedCountryCode = await detectCountryCode();

      if (cancelled) return;

      chosenCountry =
        availableCountries.find(
          (country) =>
            country.countryCode === detectedCountryCode,
        ) ?? null;
    }

    // Fall back to the previously saved currency if necessary.
    if (!chosenCountry && savedCurrencyCode) {
      chosenCountry =
        availableCountries.find(
          (country) => country.currencyCode === savedCurrencyCode,
        ) ?? null;
    }

    // Rwanda is the final fallback.
    chosenCountry ??=
      availableCountries.find(
        (country) => country.countryCode === 'RW',
      ) ?? null;

    if (chosenCountry) {
      setSelectedCountryCode(chosenCountry.countryCode);
      setCurrencyCode(chosenCountry.currencyCode);

      localStorage.setItem(
        COUNTRY_STORAGE_KEY,
        chosenCountry.countryCode,
      );
      localStorage.setItem(
        CURRENCY_STORAGE_KEY,
        chosenCountry.currencyCode,
      );
    }
  } catch (error) {
    console.error('Unable to initialize country and currency:', error);
  } finally {
    if (!cancelled) {
      setIsLoading(false);
    }
  }
}

void initializeCurrency();

return () => {
  cancelled = true;
};


}, []);



const setCountry = useCallback(
(countryCode: string) => {
const country = countries.find(
(item) => item.countryCode === countryCode,
);

  if (!country) return;

  const isAvailable =
    country.currencyCode === DEFAULT_CURRENCY ||
    (typeof rates[country.currencyCode] === 'number' &&
      Number.isFinite(rates[country.currencyCode]) &&
      rates[country.currencyCode] > 0);

  if (!isAvailable || !SUPPORTED_CURRENCIES[country.currencyCode]) {
    return;
  }

  setSelectedCountryCode(country.countryCode);
  setCurrencyCode(country.currencyCode);

  localStorage.setItem(MANUAL_COUNTRY_KEY, country.countryCode);
  localStorage.setItem(COUNTRY_STORAGE_KEY, country.countryCode);
  localStorage.setItem(CURRENCY_MANUAL_KEY, country.currencyCode);
  localStorage.setItem(CURRENCY_STORAGE_KEY, country.currencyCode);
},
[countries, rates],


);



// Keep the existing currency-selection API for compatibility.
const setCurrency = useCallback(
(code: string) => {
const isAvailable =
code === DEFAULT_CURRENCY ||
(typeof rates[code] === 'number' &&
Number.isFinite(rates[code]) &&
rates[code] > 0);

  if (!SUPPORTED_CURRENCIES[code] || !isAvailable) return;

  const matchingCountry = countries.find(
    (country) => country.currencyCode === code,
  );

  setCurrencyCode(code);

  if (matchingCountry) {
    setSelectedCountryCode(matchingCountry.countryCode);
    localStorage.setItem(
      COUNTRY_STORAGE_KEY,
      matchingCountry.countryCode,
    );
  }

  localStorage.setItem(CURRENCY_MANUAL_KEY, code);
  localStorage.setItem(CURRENCY_STORAGE_KEY, code);
},
[countries, rates],


);



const rate = getRateForCurrency(rates, currencyCode);



const availableCurrencies = Object.values(SUPPORTED_CURRENCIES).filter(
(item) =>
item.code === DEFAULT_CURRENCY ||
(typeof rates[item.code] === 'number' &&
Number.isFinite(rates[item.code]) &&
rates[item.code] > 0),
);



const availableCountries = countries.filter(
(country) =>
country.currencyCode === DEFAULT_CURRENCY ||
(SUPPORTED_CURRENCIES[country.currencyCode] &&
typeof rates[country.currencyCode] === 'number' &&
Number.isFinite(rates[country.currencyCode]) &&
rates[country.currencyCode] > 0),
);



const selectedCountry =
availableCountries.find(
(country) => country.countryCode === selectedCountryCode,
) ?? null;



const currency =
SUPPORTED_CURRENCIES[currencyCode] ??
SUPPORTED_CURRENCIES[DEFAULT_CURRENCY];



const format = useCallback(
(rwf: number) => formatPrice(rwf, currencyCode, rate),
[currencyCode, rate],
);



return (
<CurrencyContext.Provider
value={{
currency,
rate,
availableCurrencies,
availableCountries,
selectedCountry,
setCurrency,
setCountry,
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
throw new Error('useCurrency must be used inside CurrencyProvider');
}



return context;
}