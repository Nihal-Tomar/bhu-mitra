import React from 'react';
import { ChevronDownIcon } from '../icons';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error = false, className = '', disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          className={`w-full appearance-none rounded border bg-white px-3 py-2 pr-8 text-xs sm:text-sm text-slate-900 transition-colors shadow-2xs focus:outline-none focus:ring-1 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
              : 'border-slate-300 focus:border-[#0A2540] focus:ring-[#0A2540]'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <ChevronDownIcon size={14} />
        </div>
      </div>
    );
  },
);

Select.displayName = 'Select';
