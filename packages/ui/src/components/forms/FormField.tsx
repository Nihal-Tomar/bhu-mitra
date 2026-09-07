import React from 'react';

export interface FormFieldProps {
  id?: string;
  label?: React.ReactNode;
  required?: boolean;
  description?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  description,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-xs font-semibold text-slate-800 select-none flex items-center gap-1"
          >
            <span>{label}</span>
            {required && (
              <span className="text-red-600 font-bold" title="Required field">
                *
              </span>
            )}
          </label>
        </div>
      )}

      {children}

      {description && !error && (
        <p id={id ? `${id}-desc` : undefined} className="text-[11px] text-slate-500 leading-normal">
          {description}
        </p>
      )}

      {error && (
        <p
          id={id ? `${id}-error` : undefined}
          role="alert"
          className="text-[11px] font-semibold text-red-600 flex items-center gap-1"
        >
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
