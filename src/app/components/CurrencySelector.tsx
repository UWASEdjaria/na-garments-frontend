'use client';

import { SUPPORTED_CURRENCIES } from '../lib/currency.config';
import { useCurrency } from './CurrencyProvider';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency.code}
      onChange={(e) => setCurrency(e.target.value)}
      aria-label="Select display currency"
      className="rounded border border-gray-600 bg-transparent px-2 py-0.5 text-xs font-semibold text-[#EEF3F6] transition hover:border-[#F28C28] focus:outline-none focus:ring-1 focus:ring-[#F28C28] cursor-pointer"
    >
      {Object.values(SUPPORTED_CURRENCIES).map((c) => (
        <option key={c.code} value={c.code} className="bg-[#111111] text-[#EEF3F6]">
          {c.code}
        </option>
      ))}
    </select>
  );
}
