'use client';

import React from 'react';
import { LayersIcon, FilterIcon, MapPinIcon, CloseIcon } from '../icons';

export interface MapContainerProps {
  children: React.ReactNode;
  height?: string;
  className?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  children,
  height = '500px',
  className = '',
}) => {
  return (
    <div
      style={{ height }}
      className={`relative w-full rounded-lg border border-slate-300 bg-slate-100 overflow-hidden shadow-xs select-none ${className}`}
    >
      {/* Visual Placeholder grid if no map canvas loaded */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
      {children}
    </div>
  );
};

export interface MapToolbarProps {
  children?: React.ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const MapToolbar: React.FC<MapToolbarProps> = ({
  children,
  position = 'top-right',
  className = '',
}) => {
  const positionClass = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
  }[position];

  return (
    <div
      role="toolbar"
      aria-label="Map controls"
      className={`absolute z-20 flex items-center gap-1.5 p-1 rounded-md border border-slate-300/80 bg-white/95 backdrop-blur-xs shadow-md ${positionClass} ${className}`}
    >
      {children}
    </div>
  );
};

export interface MapLegendItem {
  color: string;
  label: string;
}

export interface MapLegendProps {
  title?: string;
  items: MapLegendItem[];
  position?: 'bottom-left' | 'bottom-right';
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  title = 'Cadastral Layer Legend',
  items,
  position = 'bottom-left',
  className = '',
}) => {
  const positionClass = position === 'bottom-left' ? 'bottom-3 left-3' : 'bottom-3 right-3';

  return (
    <div
      className={`absolute z-20 p-2.5 rounded-md border border-slate-300/80 bg-white/95 backdrop-blur-xs shadow-md text-xs space-y-1.5 max-w-xs ${positionClass} ${className}`}
    >
      <div className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
        <LayersIcon size={12} className="text-slate-500" />
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
            <span
              className="h-3 w-3 rounded-xs border border-black/20 shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export interface MapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  width?: string;
  className?: string;
}

export const MapDrawer: React.FC<MapDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = '320px',
  className = '',
}) => {
  if (!isOpen) return null;

  const positionClass = position === 'right' ? 'right-0' : 'left-0';

  return (
    <div
      style={{ width }}
      className={`absolute inset-y-0 ${positionClass} z-30 bg-white border-l border-slate-300 shadow-xl flex flex-col animate-in slide-in-from-right duration-200 ${className}`}
    >
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <MapPinIcon size={14} className="text-[#0A2540]" />
          <span>{title}</span>
        </h4>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200"
        >
          <CloseIcon size={14} />
        </button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto text-xs text-slate-700">
        {children}
      </div>
    </div>
  );
};

export interface MapFilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const MapFilterPanel: React.FC<MapFilterPanelProps> = ({
  isOpen,
  onToggle,
  children,
  className = '',
}) => {
  return (
    <div className={`absolute top-3 left-3 z-20 ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-xs font-semibold text-slate-800 shadow-md hover:bg-slate-50"
      >
        <FilterIcon size={14} />
        <span>Spatial Filters</span>
      </button>

      {isOpen && (
        <div className="mt-2 w-72 p-4 rounded-lg border border-slate-300 bg-white/95 backdrop-blur-xs shadow-xl text-xs space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};
