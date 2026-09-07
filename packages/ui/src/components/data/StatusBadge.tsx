import React from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  FileTextIcon,
} from '../icons';

export type BhuMitraStatus =
  | 'draft'
  | 'submitted'
  | 'underReview'
  | 'section11Issued'
  | 'objectionPending'
  | 'section19Declared'
  | 'valuationInProgress'
  | 'awardDeclared'
  | 'disbursed'
  | 'completed'
  | 'escalated'
  | 'overdue'
  | 'onHold';

export interface StatusBadgeProps {
  status: BhuMitraStatus;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className = '',
}) => {
  const configMap: Record<
    BhuMitraStatus,
    {
      defaultLabel: string;
      bg: string;
      text: string;
      border: string;
      Icon: React.ComponentType<{ size?: number; className?: string }>;
    }
  > = {
    draft: {
      defaultLabel: 'Draft',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      Icon: FileTextIcon,
    },
    submitted: {
      defaultLabel: 'Submitted',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-300',
      Icon: ClockIcon,
    },
    underReview: {
      defaultLabel: 'Under Review',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      Icon: ClockIcon,
    },
    section11Issued: {
      defaultLabel: 'Section 11 Gazette Issued',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-300',
      Icon: FileTextIcon,
    },
    objectionPending: {
      defaultLabel: 'Objection Pending',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
      Icon: AlertTriangleIcon,
    },
    section19Declared: {
      defaultLabel: 'Section 19 Declared',
      bg: 'bg-pink-50',
      text: 'text-pink-800',
      border: 'border-pink-300',
      Icon: FileTextIcon,
    },
    valuationInProgress: {
      defaultLabel: 'Valuation In Progress',
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-300',
      Icon: ClockIcon,
    },
    awardDeclared: {
      defaultLabel: 'Award Declared',
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-300',
      Icon: CheckCircleIcon,
    },
    disbursed: {
      defaultLabel: 'DBT Disbursed',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      Icon: CheckCircleIcon,
    },
    completed: {
      defaultLabel: 'Acquisition Completed',
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300',
      Icon: CheckCircleIcon,
    },
    escalated: {
      defaultLabel: 'Escalated',
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-300',
      Icon: AlertCircleIcon,
    },
    overdue: {
      defaultLabel: 'SLA Overdue',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      border: 'border-rose-400',
      Icon: AlertCircleIcon,
    },
    onHold: {
      defaultLabel: 'Judicial Stay / On Hold',
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-300',
      Icon: AlertTriangleIcon,
    },
  };

  const config = configMap[status] || configMap.draft;
  const displayText = label || config.defaultLabel;
  const Icon = config.Icon;

  const sizeClasses = size === 'sm' ? 'text-[11px] px-1.5 py-0.5 gap-1' : 'text-xs px-2 py-0.5 gap-1.5';

  return (
    <span
      role="status"
      aria-label={`Status: ${displayText}`}
      className={`inline-flex items-center font-medium rounded border tracking-tight ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <Icon size={size === 'sm' ? 12 : 13} className="shrink-0" />
      <span className="truncate">{displayText}</span>
    </span>
  );
};
