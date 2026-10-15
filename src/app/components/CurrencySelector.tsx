'use client';



import { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiSearch, FiGlobe } from 'react-icons/fi';
import { useCurrency } from './CurrencyProvider';



export default function CurrencySelector() {
const {
availableCountries,
selectedCountry,
setCountry,
isLoading,
} = useCurrency();



const [isOpen, setIsOpen] = useState(false);
const [search, setSearch] = useState('');
const containerRef = useRef<HTMLDivElement>(null);
const searchRef = useRef<HTMLInputElement>(null);



const filteredCountries = availableCountries.filter((country) => {
const query = search.trim().toLowerCase();

return (
  country.countryName.toLowerCase().includes(query) ||
  country.countryCode.toLowerCase().includes(query) ||
  country.currencyCode.toLowerCase().includes(query)
);


});



useEffect(() => {
function handleOutsideClick(event: MouseEvent) {
if (
containerRef.current &&
!containerRef.current.contains(event.target as Node)
) {
setIsOpen(false);
setSearch('');
}
}

document.addEventListener('mousedown', handleOutsideClick);

return () => {
  document.removeEventListener('mousedown', handleOutsideClick);
};


}, []);



useEffect(() => {
if (isOpen) {
searchRef.current?.focus();
}
}, [isOpen]);



function handleCountrySelect(countryCode: string) {
setCountry(countryCode);
setIsOpen(false);
setSearch('');
}



return (
  <div ref={containerRef} className="relative">
    <button
     type="button"
     onClick={() => setIsOpen((open) => !open)}
     disabled={isLoading || availableCountries.length === 0}
     aria-label="Select country and currency"
     aria-expanded={isOpen}
     aria-haspopup="listbox"
     className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-600 bg-transparent px-2 py-1.5 text-xs font-semibold text-[#EEF3F6] transition hover:border-[#F28C28] focus:outline-none focus:ring-1 focus:ring-[#F28C28] disabled:cursor-wait disabled:opacity-60"
     >
    {selectedCountry ? (
     <>

     {selectedCountry.flag}

    {selectedCountry.currencyCode}
   </>
   ) : (
   <>

   {isLoading ? 'Loading' : 'Country'}
  </>
  )}

    <FiChevronDown
      aria-hidden="true"
      className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
    />
  </button>

  {isOpen && (
    <div className="absolute right-0 top-full z-[100] mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-xl sm:w-80">
      <div className="border-b border-gray-200 p-3">
        <label
          htmlFor="country-currency-search"
          className="mb-2 block text-xs font-semibold text-gray-600"
        >
          Choose your country or currency
        </label>

        <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 focus-within:border-[#F28C28] focus-within:ring-1 focus-within:ring-[#F28C28]">
          <FiSearch
            className="shrink-0 text-gray-500"
            aria-hidden="true"
          />

          <input
            ref={searchRef}
            id="country-currency-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search country or currency..."
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div
        role="listbox"
        aria-label="Available countries"
        className="max-h-72 overflow-y-auto p-1.5"
      >
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => {
            const isSelected =
              selectedCountry?.countryCode === country.countryCode;

            return (
              <button
                key={country.countryCode}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() =>
                  handleCountrySelect(country.countryCode)
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-gray-100 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                <span
                  className="text-xl"
                  aria-hidden="true"
                >
                  {country.flag}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">
                    {country.countryName}
                  </span>

                  <span className="block text-xs text-gray-500">
                    {country.currencyCode}
                  </span>
                </span>

                {isSelected && (
                  <span className="text-xs font-semibold text-[#123B5D]">
                    Selected
                  </span>
                )}
              </button>
            );
          })
        ) : (
          <p className="px-3 py-8 text-center text-sm text-gray-500">
            No countries found. Try another search.
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 px-3 py-2">
        <p className="text-xs text-gray-500">
          Prices are displayed in the selected currency.
        </p>
      </div>
    </div>
  )}
</div>


);
}