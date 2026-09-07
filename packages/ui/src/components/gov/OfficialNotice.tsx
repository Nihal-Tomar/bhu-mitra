import React from 'react';
import { LandmarkIcon, FileTextIcon } from '../icons';

export interface OfficialNoticeProps {
  gazetteNumber: string;
  section: string;
  issueDate: string;
  issuingAuthority: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const OfficialNotice: React.FC<OfficialNoticeProps> = ({
  gazetteNumber,
  section,
  issueDate,
  issuingAuthority,
  title,
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative p-5 sm:p-6 rounded-lg border-2 border-[#0A2540]/30 bg-amber-50/20 shadow-xs overflow-hidden ${className}`}
    >
      {/* Decorative Government Watermark Outline */}
      <div
        className="absolute right-4 bottom-2 text-slate-200/40 pointer-events-none select-none"
        aria-hidden="true"
      >
        <LandmarkIcon size={120} />
      </div>

      {/* Notice Header */}
      <div className="relative z-10 pb-3 border-b border-slate-200/80 mb-3 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold tracking-wider text-[#0A2540] uppercase flex items-center gap-1.5">
            <FileTextIcon size={14} />
            <span>STATUTORY GAZETTE NOTIFICATION — {section}</span>
          </span>
          <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
            {gazetteNumber}
          </span>
        </div>

        <h4 className="text-sm sm:text-base font-bold text-slate-900 font-serif pt-1">
          {title}
        </h4>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
          <span>Authority: <strong className="text-slate-700">{issuingAuthority}</strong></span>
          <span>Date of Notification: <strong className="text-slate-700 font-mono">{issueDate}</strong></span>
        </div>
      </div>

      {/* Notice Body */}
      <div className="relative z-10 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
        {children}
      </div>
    </div>
  );
};
