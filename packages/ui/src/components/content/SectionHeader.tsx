import React from 'react';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
  badge,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          {badge && <div>{badge}</div>}
        </div>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-normal">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
