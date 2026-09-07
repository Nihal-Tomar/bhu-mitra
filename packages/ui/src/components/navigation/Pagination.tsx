'use client';

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  className = '',
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      aria-label="Table pagination"
      className={`flex flex-wrap items-center justify-between gap-3 py-3 px-4 border-t border-slate-200 text-xs text-slate-600 bg-white ${className}`}
    >
      {/* Left: Record summary and page size */}
      <div className="flex items-center gap-3">
        {totalItems !== undefined ? (
          <span>
            Showing <strong className="font-semibold text-slate-900">{startItem}</strong> to{' '}
            <strong className="font-semibold text-slate-900">{endItem}</strong> of{' '}
            <strong className="font-semibold text-slate-900">{totalItems}</strong> records
          </span>
        ) : (
          <span>
            Page <strong className="font-semibold text-slate-900">{currentPage}</strong> of{' '}
            <strong className="font-semibold text-slate-900">{totalPages}</strong>
          </span>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <label htmlFor="pagination-size" className="text-slate-500">
              Per page:
            </label>
            <select
              id="pagination-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 rounded border border-slate-300 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeftIcon size={14} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400 select-none">
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={`Page ${page}`}
              className={`min-w-[28px] h-7 px-2 rounded text-xs font-medium transition-colors ${
                isCurrent
                  ? 'bg-[#0A2540] text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon size={14} />
        </button>
      </div>
    </nav>
  );
};
