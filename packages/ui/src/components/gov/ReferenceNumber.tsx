'use client';

import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from '../icons';

export interface ReferenceNumberProps {
  value: string;
  prefix?: string;
  copyable?: boolean;
  className?: string;
}

export const ReferenceNumber: React.FC<ReferenceNumberProps> = ({
  value,
  prefix = 'REF',
  copyable = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copyable) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-300 bg-slate-100/90 text-xs font-mono text-slate-800 shadow-2xs ${className}`}
    >
      <span className="text-[10px] font-bold text-slate-500">{prefix}:</span>
      <span className="font-semibold">{value}</span>
      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : `Copy ${prefix} ${value}`}
          title={copied ? 'Copied to clipboard' : 'Copy identifier'}
          className="p-0.5 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
        >
          {copied ? <CheckIcon size={12} className="text-emerald-600" /> : <CopyIcon size={12} />}
        </button>
      )}
    </span>
  );
};

export interface AuditMetadataProps {
  createdAt: string;
  officerId: string;
  officerRole: string;
  transactionHash?: string;
  ipAddress?: string;
  className?: string;
}

export const AuditMetadata: React.FC<AuditMetadataProps> = ({
  createdAt,
  officerId,
  officerRole,
  transactionHash,
  ipAddress,
  className = '',
}) => {
  return (
    <div
      className={`p-3 rounded border border-slate-200 bg-slate-50/70 text-[11px] font-mono text-slate-600 space-y-1 ${className}`}
    >
      <div className="font-bold text-slate-700 tracking-wider text-[10px] uppercase font-sans">
        CAG & Statutory Audit Trail
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
        <div>
          <span className="text-slate-400">Timestamp:</span> {createdAt}
        </div>
        <div>
          <span className="text-slate-400">Officer:</span> {officerId} ({officerRole})
        </div>
        {ipAddress && (
          <div>
            <span className="text-slate-400">IP Node:</span> {ipAddress}
          </div>
        )}
        {transactionHash && (
          <div className="truncate">
            <span className="text-slate-400">Hash:</span> {transactionHash}
          </div>
        )}
      </div>
    </div>
  );
};
