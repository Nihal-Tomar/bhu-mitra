import React from 'react';
import {
  InfoIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  LandmarkIcon,
  CloseIcon,
} from '../icons';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'legalCaveat';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  className = '',
}) => {
  const config = {
    info: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-900',
      Icon: InfoIcon,
      iconColor: 'text-sky-700',
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      Icon: CheckCircleIcon,
      iconColor: 'text-emerald-700',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      Icon: AlertTriangleIcon,
      iconColor: 'text-amber-700',
    },
    error: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-900',
      Icon: AlertCircleIcon,
      iconColor: 'text-rose-700',
    },
    legalCaveat: {
      bg: 'bg-[#0A2540]/5',
      border: 'border-[#0A2540]/20',
      text: 'text-[#0A2540]',
      Icon: LandmarkIcon,
      iconColor: 'text-[#0A2540]',
    },
  }[variant];

  const Icon = config.Icon;

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 p-3.5 sm:p-4 rounded-lg border text-xs sm:text-sm leading-relaxed ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${config.iconColor}`} aria-hidden="true" />

      <div className="flex-1 space-y-0.5">
        {title && <h5 className="font-semibold text-xs sm:text-sm leading-tight">{title}</h5>}
        <div className="text-xs opacity-90">{children}</div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="p-1 -mr-1 -mt-1 rounded text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          <CloseIcon size={14} />
        </button>
      )}
    </div>
  );
};
