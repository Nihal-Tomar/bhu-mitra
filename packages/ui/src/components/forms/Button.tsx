import React from 'react';
import { RefreshCwIcon } from '../icons';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon: Icon,
      iconPosition = 'left',
      className = '',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none';

    const variantStyles = {
      primary:
        'bg-[#0A2540] text-white hover:bg-[#061626] focus:ring-[#0A2540] shadow-xs active:bg-[#040e1a]',
      secondary:
        'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400 active:bg-slate-300',
      outline:
        'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-[#0A2540] shadow-2xs',
      destructive:
        'bg-red-700 text-white hover:bg-red-800 focus:ring-red-700 shadow-xs active:bg-red-900',
      ghost:
        'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300',
      link:
        'text-[#0A2540] hover:underline p-0 h-auto font-medium focus:ring-0',
    }[variant];

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
      md: 'text-xs sm:text-sm px-3.5 py-2 gap-2 h-9 sm:h-10',
      lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5 h-11',
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles} ${variant !== 'link' ? sizeStyles : ''} ${className}`}
        {...props}
      >
        {loading ? (
          <RefreshCwIcon size={14} className="animate-spin shrink-0" aria-hidden="true" />
        ) : (
          Icon && iconPosition === 'left' && <Icon size={14} className="shrink-0" aria-hidden="true" />
        )}
        <span>{children}</span>
        {!loading && Icon && iconPosition === 'right' && (
          <Icon size={14} className="shrink-0" aria-hidden="true" />
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
