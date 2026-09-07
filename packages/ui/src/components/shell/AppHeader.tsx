'use client';

import React from 'react';
import { useLocale } from '../../localization';
import { BellIcon, MenuIcon, LandmarkIcon } from '../icons';

export interface AppHeaderProps {
  /** Title of the application or portal section */
  title?: string;
  /** Active user or officer role designation */
  userRole?: string;
  /** User name */
  userName?: string;
  /** Unread notifications count */
  notificationCount?: number;
  /** Callback when mobile navigation menu toggle is clicked */
  onMenuToggle?: () => void;
  /** Custom CSS classes */
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  userRole = 'CALA / District Collectorate',
  userName = 'Collector & District Magistrate',
  notificationCount = 3,
  onMenuToggle,
  className = '',
}) => {
  const { t, isHindi } = useLocale();

  return (
    <div className={`w-full bg-[#0A2540] text-white border-b border-slate-700/60 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Bhu-Mitra Platform Identity */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              type="button"
              onClick={onMenuToggle}
              aria-label="Toggle navigation menu"
              className="md:hidden p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <MenuIcon size={20} />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-white/10 border border-white/15 text-amber-400 shadow-inner flex items-center justify-center">
              <LandmarkIcon size={22} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-serif">
                  {isHindi ? 'भूमि-मित्र' : 'Bhu-Mitra'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-normal line-clamp-1">
                {title || t('gov.tagline', 'National Land Acquisition, Valuation & Monitoring Platform')}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Officer Designation & User Area */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <button
            type="button"
            aria-label={`Notifications: ${notificationCount} unread`}
            className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <BellIcon size={18} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF671F] text-[10px] font-bold text-white ring-2 ring-[#0A2540]">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Officer Role Badge */}
          <div className="hidden sm:flex flex-col text-right pl-2 border-l border-slate-700">
            <span className="text-xs font-semibold text-white leading-tight">{userName}</span>
            <span className="text-[10px] text-amber-300 font-medium leading-tight">{userRole}</span>
          </div>

          {/* User Profile Avatar Pill */}
          <div
            className="h-8 w-8 rounded-full bg-slate-700 border border-slate-500 text-amber-300 flex items-center justify-center text-xs font-bold shadow-inner"
            title={userName}
            aria-hidden="true"
          >
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};
