import { ChangeEvent } from 'react';

interface CustomOrderInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'tel' | 'number';
  placeholder?: string;
  required?: boolean;
  min?: number;
}

export default function CustomOrderInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  min,
}: CustomOrderInputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-[#123B5D]"
      >
        {label}
        {required && (
          <span className="ml-1 text-[#F28C28]">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-[#111111] outline-none transition-all duration-200 ease-out placeholder:text-gray-400 hover:-translate-y-1 hover:border-[#F28C28] focus:translate-y-0 focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20 focus:shadow-[0_4px_12px_rgba(242,140,40,0.12)]"
      />
    </div>
  );
}