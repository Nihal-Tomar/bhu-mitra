import React from 'react';
import { AlertCircleIcon, ClockIcon, AlertTriangleIcon } from '../icons';

export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

export interface PriorityBadgeProps {
  priority: PriorityLevel;
  label?: string;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  label,
  className = '',
}) => {
  const config = {
    urgent: {
      text: 'text-red-900',
      bg: 'bg-red-50',
      border: 'border-red-300',
      defaultLabel: 'Urgent',
      Icon: AlertCircleIcon,
    },
    high: {
      text: 'text-orange-900',
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      defaultLabel: 'High',
      Icon: AlertTriangleIcon,
    },
    medium: {
      text: 'text-amber-900',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      defaultLabel: 'Medium',
      Icon: ClockIcon,
    },
    low: {
      text: 'text-slate-700',
      bg: 'bg-slate-50',
      border: 'border-slate-300',
      defaultLabel: 'Low',
      Icon: ClockIcon,
    },
  }[priority];

  const Icon = config.Icon;
  const displayText = label || config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
      aria-label={`Priority: ${displayText}`}
    >
      <Icon size={12} className="shrink-0" />
      <span>{displayText}</span>
    </span>
  );
};

export interface SlaIndicatorProps {
  daysRemaining: number;
  totalDays?: number;
  statutoryLimitDate?: string;
  className?: string;
}

export const SlaIndicator: React.FC<SlaIndicatorProps> = ({
  daysRemaining,
  statutoryLimitDate,
  className = '',
}) => {
  const isOverdue = daysRemaining < 0;
  const isCritical = daysRemaining <= 7 && !isOverdue;
  const isWarning = daysRemaining > 7 && daysRemaining <= 15;

  let statusClass = 'text-emerald-800 bg-emerald-50 border-emerald-300';
  if (isOverdue) statusClass = 'text-rose-900 bg-rose-50 border-rose-400 font-bold';
  else if (isCritical) statusClass = 'text-red-900 bg-red-50 border-red-300';
  else if (isWarning) statusClass = 'text-amber-900 bg-amber-50 border-amber-300';

  return (
    <div
      className={`inline-flex flex-col p-1.5 px-2 rounded border text-xs leading-tight ${statusClass} ${className}`}
      role="status"
    >
      <div className="flex items-center gap-1 font-semibold">
        <ClockIcon size={12} />
        <span>
          {isOverdue
            ? `SLA Breach (${Math.abs(daysRemaining)}d overdue)`
            : `${daysRemaining} days remaining`}
        </span>
      </div>
      {statutoryLimitDate && (
        <span className="text-[10px] opacity-80 mt-0.5">
          Limit: {statutoryLimitDate}
        </span>
      )}
    </div>
  );
};

export interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs text-slate-600">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showPercentage && <span className="font-mono font-semibold">{percentage}%</span>}
        </div>
      )}
      <div
        className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className="h-full bg-[#0A2540] transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
