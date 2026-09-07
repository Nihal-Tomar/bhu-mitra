'use client';

import React, { useEffect } from 'react';
import { Sidebar, type SidebarNavItem, defaultSidebarNavItems } from './Sidebar';
import { CloseIcon } from '../icons';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  items?: SidebarNavItem[];
  activeId?: string;
  onSelect?: (item: SidebarNavItem) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  items = defaultSidebarNavItems,
  activeId,
  onSelect,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#0A2540] text-white">
          <span className="text-sm font-bold">Bhu-Mitra Navigation</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Sidebar
            items={items}
            activeId={activeId}
            onSelect={(item) => {
              onSelect?.(item);
              onClose();
            }}
            className="w-full border-r-0"
          />
        </div>
      </div>
    </div>
  );
};
