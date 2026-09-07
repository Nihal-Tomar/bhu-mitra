import React from 'react';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  actor?: string;
  statusBadge?: React.ReactNode;
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`} aria-label="Official activity timeline">
      {events.map((event, idx) => {
        const isLast = idx === events.length - 1;

        return (
          <div key={event.id} className="relative flex items-start gap-3">
            {/* Vertical connector line */}
            {!isLast && (
              <div
                className="absolute left-2.5 top-5 -bottom-4 w-0.5 bg-slate-200"
                aria-hidden="true"
              />
            )}

            {/* Marker Dot */}
            <div
              className="h-5 w-5 rounded-full bg-white border-2 border-[#0A2540] flex items-center justify-center shrink-0 z-10"
              aria-hidden="true"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[#0A2540]" />
            </div>

            {/* Content */}
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-xs font-semibold text-slate-900">{event.title}</span>
                <span className="text-[11px] font-mono text-slate-400">{event.timestamp}</span>
              </div>
              {event.description && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{event.description}</p>
              )}
              <div className="mt-1 flex items-center gap-2">
                {event.actor && (
                  <span className="text-[10px] text-slate-500 font-medium">By: {event.actor}</span>
                )}
                {event.statusBadge && <div>{event.statusBadge}</div>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface ApprovalStepProps {
  roleTitle: string;
  officerName: string;
  status: 'pending' | 'approved' | 'rejected' | 'forwarded';
  timestamp?: string;
  remarks?: string;
  className?: string;
}

export const ApprovalStep: React.FC<ApprovalStepProps> = ({
  roleTitle,
  officerName,
  status,
  timestamp,
  remarks,
  className = '',
}) => {
  const statusConfig = {
    pending: { label: 'Pending Approval', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    approved: { label: 'Digitally Approved', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    rejected: { label: 'Returned for Revision', color: 'bg-rose-100 text-rose-800 border-rose-300' },
    forwarded: { label: 'Forwarded to State Nodal', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  }[status];

  return (
    <div className={`p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 text-xs ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-bold text-slate-900 block">{roleTitle}</span>
          <span className="text-slate-600 text-[11px]">{officerName}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      {remarks && (
        <div className="p-2 rounded bg-slate-50 border border-slate-100 text-slate-700 italic text-[11px]">
          &ldquo;{remarks}&rdquo;
        </div>
      )}

      {timestamp && (
        <div className="text-[10px] text-slate-400 font-mono">
          Timestamp: {timestamp}
        </div>
      )}
    </div>
  );
};
