import React from 'react';
import { Breadcrumbs, type BreadcrumbItem } from '../navigation/Breadcrumbs';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  badge?: React.ReactNode;
  referenceNo?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  badge,
  referenceNo,
  actions,
  className = '',
}) => {
  return (
    <div className={`pb-5 mb-6 border-b border-slate-200/80 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-2.5">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
            {referenceNo && (
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {referenceNo}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center flex-wrap gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
