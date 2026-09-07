import React from 'react';
import { ChevronRightIcon } from '../icons';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumbs" className={`flex items-center text-xs text-slate-500 ${className}`}>
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRightIcon size={12} className="text-slate-400 shrink-0" aria-hidden="true" />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-slate-900 truncate max-w-xs"
                >
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-slate-900 hover:underline transition-colors truncate max-w-xs"
                >
                  {item.label}
                </button>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="hover:text-slate-900 hover:underline transition-colors truncate max-w-xs"
                >
                  {item.label}
                </a>
              ) : (
                <span className="truncate max-w-xs">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
