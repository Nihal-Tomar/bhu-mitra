import React from 'react';
import { CalendarIcon } from '../icons';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ error = false, className = '', disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <CalendarIcon size={14} />
        </div>
        <input
          ref={ref}
          type="date"
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          className={`w-full rounded border bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 shadow-2xs focus:outline-none focus:ring-1 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
              : 'border-slate-300 focus:border-[#0A2540] focus:ring-[#0A2540]'
          } ${className}`}
          {...props}
        />
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
