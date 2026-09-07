import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error = false, className = '', id, disabled, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className={`flex items-start gap-2.5 ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          className={`h-4 w-4 mt-0.5 rounded border-slate-300 text-[#0A2540] focus:ring-[#0A2540] disabled:opacity-50 ${
            error ? 'border-red-500 ring-1 ring-red-500' : ''
          }`}
          {...props}
        />
        {(label || description) && (
          <div className="flex flex-col text-xs leading-normal">
            {label && (
              <label
                htmlFor={inputId}
                className={`font-medium text-slate-800 select-none ${
                  disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-slate-500 text-[11px] mt-0.5 leading-normal">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  error = false,
  className = '',
}) => {
  return (
    <div role="radiogroup" className={`space-y-2 ${className}`}>
      {options.map((opt) => {
        const isChecked = value === opt.value;
        const optId = `${name}-${opt.value}`;

        return (
          <div key={opt.value} className="flex items-start gap-2.5">
            <input
              type="radio"
              id={optId}
              name={name}
              value={opt.value}
              checked={isChecked}
              disabled={opt.disabled}
              onChange={() => onChange?.(opt.value)}
              aria-invalid={error ? 'true' : undefined}
              className="h-4 w-4 mt-0.5 border-slate-300 text-[#0A2540] focus:ring-[#0A2540] disabled:opacity-50"
            />
            <div className="flex flex-col text-xs">
              <label
                htmlFor={optId}
                className={`font-medium text-slate-800 select-none ${
                  opt.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {opt.label}
              </label>
              {opt.description && (
                <span className="text-slate-500 text-[11px] mt-0.5 leading-normal">
                  {opt.description}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
  className = '',
}) => {
  const switchId = id || React.useId();

  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      {(label || description) && (
        <div className="flex flex-col text-xs leading-normal">
          {label && (
            <label
              htmlFor={switchId}
              className={`font-medium text-slate-800 select-none ${
                disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {label}
            </label>
          )}
          {description && (
            <span className="text-slate-500 text-[11px] mt-0.5 leading-normal">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0A2540] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-[#0A2540]' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
