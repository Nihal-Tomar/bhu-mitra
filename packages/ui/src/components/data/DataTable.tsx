'use client';

import React, { useState } from 'react';
import { Pagination } from '../navigation/Pagination';
import { ChevronDownIcon, SearchIcon, FilterIcon } from '../icons';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  // Pagination
  paginated?: boolean;
  pageSize?: number;
  // Filtering / Search
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  className?: string;
  // Extra table toolbar actions
  toolbarActions?: React.ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = 'No official records found matching the query.',
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  paginated = true,
  pageSize = 10,
  searchable = false,
  searchPlaceholder = 'Filter records...',
  searchValue = '',
  onSearchChange,
  className = '',
  toolbarActions,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Filter items
  const filteredData = React.useMemo(() => {
    const query = (onSearchChange ? searchValue : localSearch).toLowerCase().trim();
    if (!query) return data;

    return data.filter((item) =>
      Object.values(item).some((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(query);
        }
        return false;
      }),
    );
  }, [data, localSearch, searchValue, onSearchChange]);

  // Sort items
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = paginated
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  // Selection handlers
  const allPageIds = paginatedData.map((item, idx) => keyExtractor(item, idx));
  const isAllSelected =
    allPageIds.length > 0 && allPageIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;
    if (isAllSelected) {
      onSelectionChange(selectedIds.filter((id) => !allPageIds.includes(id)));
    } else {
      const newSelected = Array.from(new Set([...selectedIds, ...allPageIds]));
      onSelectionChange(newSelected);
    }
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className={`w-full rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden ${className}`}>
      {/* Table Toolbar */}
      {(searchable || toolbarActions) && (
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {searchable && (
            <div className="relative max-w-sm w-full">
              <SearchIcon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={onSearchChange ? searchValue : localSearch}
                onChange={(e) => {
                  const val = e.target.value;
                  if (onSearchChange) onSearchChange(val);
                  else setLocalSearch(val);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0A2540] focus:border-[#0A2540]"
              />
            </div>
          )}

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {selectable && selectedIds.length > 0 && (
              <span className="text-xs font-semibold px-2 py-1 rounded bg-[#0A2540] text-white">
                {selectedIds.length} selected
              </span>
            )}
            {toolbarActions}
          </div>
        </div>
      )}

      {/* Table Canvas with Scroll Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 select-none">
              {selectable && (
                <th scope="col" className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all rows on page"
                    className="h-3.5 w-3.5 rounded border-slate-300 text-[#0A2540] focus:ring-[#0A2540]"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignClass =
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left';

                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    className={`px-4 py-3 font-semibold tracking-wider uppercase text-[11px] text-slate-700 ${alignClass} ${col.className || ''}`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1 group focus:outline-none focus:underline"
                        aria-label={`Sort by ${String(col.header)}`}
                      >
                        <span>{col.header}</span>
                        <ChevronDownIcon
                          size={12}
                          className={`transition-transform text-slate-400 group-hover:text-slate-700 ${
                            isSorted && sortDirection === 'desc'
                              ? 'rotate-180 text-[#0A2540]'
                              : isSorted
                              ? 'text-[#0A2540]'
                              : ''
                          }`}
                        />
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              // Loading Skeleton
              Array.from({ length: 4 }).map((_, rIdx) => (
                <tr key={`skeleton-${rIdx}`} className="animate-pulse">
                  {selectable && <td className="px-3 py-3"><div className="h-3.5 w-3.5 bg-slate-200 rounded mx-auto" /></td>}
                  {columns.map((_c, cIdx) => (
                    <td key={`scol-${cIdx}`} className="px-4 py-3.5">
                      <div className="h-3 bg-slate-200 rounded w-4/5" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State Row
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  <div className="max-w-xs mx-auto space-y-2">
                    <FilterIcon size={24} className="mx-auto text-slate-400" />
                    <p className="text-xs font-semibold text-slate-700">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Real Data Rows
              paginatedData.map((item, index) => {
                const id = keyExtractor(item, index);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      isSelected ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    {selectable && (
                      <td className="w-10 px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                          aria-label={`Select row ${id}`}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-[#0A2540] focus:ring-[#0A2540]"
                        />
                      </td>
                    )}

                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';

                      const value = item[col.key];

                      return (
                        <td
                          key={`${id}-${col.key}`}
                          className={`px-4 py-3 text-slate-800 ${alignClass} ${col.className || ''}`}
                        >
                          {col.render
                            ? col.render(item, index)
                            : value !== undefined && value !== null
                            ? String(value)
                            : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {paginated && !loading && sortedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
