import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, icon: Icon, className = '', disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={14} />
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          className={`w-full rounded border bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-colors shadow-2xs focus:outline-none focus:ring-1 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
            Icon ? 'pl-9' : ''
          } ${
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

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className = '', disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        className={`w-full rounded border bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-colors shadow-2xs focus:outline-none focus:ring-1 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
          error
            ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
            : 'border-slate-300 focus:border-[#0A2540] focus:ring-[#0A2540]'
        } ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
