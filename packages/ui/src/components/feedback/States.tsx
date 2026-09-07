import React from 'react';
import { FilterIcon, RefreshCwIcon, AlertTriangleIcon } from '../icons';
import { Button } from '../forms/Button';

export interface StateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<StateProps> = ({
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="p-3 rounded-full bg-slate-200/60 text-slate-500">
        <FilterIcon size={24} />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        {description && <p className="text-xs text-slate-500 leading-normal">{description}</p>}
      </div>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading official data records...',
  className = '',
}) => {
  return (
    <div
      className={`p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 ${className}`}
      role="status"
    >
      <RefreshCwIcon size={24} className="animate-spin text-[#0A2540]" />
      <span className="text-xs font-semibold text-slate-600">{message}</span>
    </div>
  );
};

export const ErrorState: React.FC<StateProps> = ({
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-lg border border-red-200 bg-red-50/40 flex flex-col items-center justify-center space-y-3 ${className}`}
      role="alert"
    >
      <div className="p-3 rounded-full bg-red-100 text-red-700">
        <AlertTriangleIcon size={24} />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold text-red-900">{title}</h4>
        {description && <p className="text-xs text-red-700 leading-normal">{description}</p>}
      </div>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
};
