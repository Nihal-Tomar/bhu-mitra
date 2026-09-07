'use client';

import React, { useState } from 'react';
import { GovEmblem } from '../emblem/GovEmblem';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLocale } from '../../localization';

export interface GovMastheadProps {
  /** Optional custom emblem image source */
  emblemSrc?: string;
  /** Optional main content target ID for skip-to-content accessibility link */
  skipToId?: string;
  /** Custom CSS classes */
  className?: string;
}

export const GovMasthead: React.FC<GovMastheadProps> = ({
  emblemSrc,
  skipToId = 'main-content',
  className = '',
}) => {
  const { t, isHindi } = useLocale();
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeOffset, setFontSizeOffset] = useState(0);

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (typeof document !== 'undefined') {
      if (next) {
        document.documentElement.classList.add('gov-high-contrast');
      } else {
        document.documentElement.classList.remove('gov-high-contrast');
      }
    }
  };

  const adjustTextSize = (delta: number) => {
    const newOffset = Math.max(-2, Math.min(4, fontSizeOffset + delta));
    setFontSizeOffset(newOffset);
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${100 + newOffset * 6.25}%`;
    }
  };

  return (
    <header
      style={{ backgroundColor: '#061626' }}
      className={`w-full bg-[#061626] text-white border-b border-slate-800 ${className}`}
    >
      {/* Accessible Skip Link */}
      <a
        href={`#${skipToId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-slate-950 focus:font-semibold focus:rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        {t('gov.skipToMain', 'Skip to main content')}
      </a>

      {/* Restrained Indian Civic Tricolor Top Bar (3px) */}
      <div className="h-1 w-full flex" aria-hidden="true">
        <div className="h-full w-1/3 bg-[#FF671F]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#046A38]" />
      </div>

      {/* Main Masthead Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-y-2">
        {/* Left: Emblem & Ministry Hierarchy */}
        <div className="flex items-center gap-3.5">
          <GovEmblem src={emblemSrc} size={42} className="shrink-0 bg-white/5 border-white/20 text-white" />
          
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100">
                {isHindi ? 'भारत सरकार' : 'Government of India'}
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline" aria-hidden="true">|</span>
              <span className="text-xs text-slate-300 font-normal hidden sm:inline">
                {isHindi ? 'Government of India' : 'भारत सरकार'}
              </span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium">
              {t('gov.ministry', 'Ministry of Rural Development')}
            </div>
            <div className="text-[10px] sm:text-[11px] text-amber-300/90 font-medium">
              {t('gov.department', 'Department of Land Resources')}
            </div>
          </div>
        </div>

        {/* Right: Accessibility Utilities & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs" aria-label="Accessibility & Localization">
          {/* Text Size Resizer */}
          <div className="hidden md:inline-flex items-center rounded border border-white/20 bg-white/5 px-1 py-0.5 gap-1 text-[11px]">
            <span className="text-slate-400 px-1 select-none">A</span>
            <button
              type="button"
              onClick={() => adjustTextSize(-1)}
              aria-label="Decrease font size"
              className="px-1.5 py-0.5 rounded text-slate-300 hover:text-white hover:bg-white/10"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => adjustTextSize(1)}
              aria-label="Increase font size"
              className="px-1.5 py-0.5 rounded text-slate-300 hover:text-white hover:bg-white/10"
            >
              +
            </button>
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            type="button"
            onClick={toggleContrast}
            aria-pressed={highContrast}
            aria-label="Toggle high contrast view"
            className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-medium transition-colors ${
              highContrast
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                : 'bg-white/5 border-white/20 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {isHindi ? 'उच्च कंट्रास्ट' : 'Contrast'}
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher variant="masthead" />
        </div>
      </div>
    </header>
  );
};
