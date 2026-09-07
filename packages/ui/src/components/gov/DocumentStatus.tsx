import React from 'react';
import { FileTextIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon } from '../icons';

export type DocumentLifecycleStatus = 'draft' | 'pending_signature' | 'published' | 'superseded' | 'revoked';

export interface DocumentStatusProps {
  documentType: string;
  documentNumber: string;
  status: DocumentLifecycleStatus;
  publishedDate?: string;
  signatory?: string;
  verificationHash?: string;
  className?: string;
}

export const DocumentStatus: React.FC<DocumentStatusProps> = ({
  documentType,
  documentNumber,
  status,
  publishedDate,
  signatory,
  verificationHash,
  className = '',
}) => {
  const statusConfig = {
    draft: {
      label: 'Draft',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      Icon: ClockIcon,
    },
    pending_signature: {
      label: 'Pending e-Signature',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      Icon: ClockIcon,
    },
    published: {
      label: 'Gazetted & Published',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      Icon: CheckCircleIcon,
    },
    superseded: {
      label: 'Superseded by Corrigendum',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
      Icon: AlertCircleIcon,
    },
    revoked: {
      label: 'Statutorily Revoked',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      Icon: AlertCircleIcon,
    },
  }[status];

  const Icon = statusConfig.Icon;

  return (
    <div
      className={`p-3.5 rounded-lg border bg-white shadow-2xs space-y-2 text-xs ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#0A2540]/5 text-[#0A2540]">
            <FileTextIcon size={16} />
          </div>
          <div>
            <div className="font-bold text-slate-900">{documentType}</div>
            <div className="font-mono text-[11px] text-slate-500">{documentNumber}</div>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
        >
          <Icon size={11} />
          <span>{statusConfig.label}</span>
        </span>
      </div>

      {(publishedDate || signatory || verificationHash) && (
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600">
          {publishedDate && (
            <div>
              <span className="text-slate-400">Date:</span> <span className="font-mono">{publishedDate}</span>
            </div>
          )}
          {signatory && (
            <div>
              <span className="text-slate-400">Signatory:</span> <span>{signatory}</span>
            </div>
          )}
          {verificationHash && (
            <div className="sm:col-span-2 font-mono text-[10px] text-slate-500 truncate">
              <span className="text-slate-400 font-sans">Digital Signature Hash:</span> {verificationHash}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
