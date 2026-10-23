'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { useCurrency } from './CurrencyProvider';

export default function CurrencySelector() {
  const { currency, countries, setCurrency, isLoading } = useCurrency();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const currencyCountries = useMemo(() => {
    const unique = new Map<string, (typeof countries)[number]>();

    for (const country of countries) {
      if (!unique.has(country.currencyCode)) {
        unique.set(country.currencyCode, country);
      }
    }

    return Array.from(unique.values()).sort((a, b) =>
      a.countryName.localeCompare(b.countryName),
    );
  }, [countries]);

  const filteredCountries = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return currencyCountries;

    return currencyCountries.filter(
      (country) =>
        country.countryName.toLowerCase().includes(search) ||
        country.currencyCode.toLowerCase().includes(search) ||
        country.countryCode.toLowerCase().includes(search),
    );
  }, [currencyCountries, query]);

  useEffect(() => {
    if (!open) return;

    searchRef.current?.focus();

    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery('');
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-label="Choose country and currency"
        aria-expanded={open}
        className="flex max-w-[180px] items-center gap-1.5 rounded border border-gray-600 bg-transparent px-2 py-1 text-xs font-semibold text-[#EEF3F6] transition hover:border-[#F28C28] focus:outline-none focus:ring-1 focus:ring-[#F28C28]"
      >
        <span>{currency.code}</span>
        <FiChevronDown className="h-3.5 w-3.5 shrink-0" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl">
          <div className="border-b border-slate-200 p-3">
            <label
              htmlFor="country-currency-search"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              Search country or currency
            </label>

            <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
              <FiSearch className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                ref={searchRef}
                id="country-currency-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. Rwanda, Kenya, USD"
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto p-1.5">
            {isLoading ? (
              <p className="px-3 py-4 text-center text-sm text-slate-500">
                Loading countries...
              </p>
            ) : filteredCountries.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-slate-500">
                No matching countries found.
              </p>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.currencyCode}
                  type="button"
                  onClick={() => {
                    setCurrency(country.currencyCode);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-100 ${
                    currency.code === country.currencyCode
                      ? 'bg-slate-100 font-semibold'
                      : ''
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">
                    {country.flag}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {country.countryName}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {country.currencyCode}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
