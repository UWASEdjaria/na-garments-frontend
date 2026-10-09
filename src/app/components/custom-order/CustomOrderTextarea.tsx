import { ChangeEvent } from 'react';

interface CustomOrderTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export default function CustomOrderTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: CustomOrderTextareaProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-[#123B5D] mb-2"
      >
        {label}
        {required && (
          <span className="text-[#F28C28] ml-1">*</span>
        )}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-[#111111] outline-none transition resize-y focus:border-[#123B5D] focus:ring-2 focus:ring-[#123B5D]/10"
      />
    </div>
  );
}