'use client';

import React from 'react';
import { useLocale } from '../../localization';
import { GlobeIcon } from '../icons';

export interface LanguageSwitcherProps {
  className?: string;
  variant?: 'masthead' | 'header' | 'standalone';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'masthead',
}) => {
  const { locale, setLocale } = useLocale();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'hi' : 'en');
  };

  const isHindi = locale === 'hi';

  if (variant === 'masthead') {
    return (
      <button
        type="button"
        onClick={toggleLocale}
        aria-label={isHindi ? 'Switch language to English' : 'भाषा बदलकर हिंदी करें'}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded border transition-colors ${
          isHindi
            ? 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
        } ${className}`}
      >
        <GlobeIcon size={13} className="text-current" />
        <span>{isHindi ? 'English' : 'हिंदी'}</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center rounded-md border border-slate-300 bg-white p-0.5 text-xs font-medium shadow-sm ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={!isHindi}
        className={`px-2.5 py-1 rounded transition-colors ${
          !isHindi
            ? 'bg-[#0A2540] text-white font-semibold shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLocale('hi')}
        aria-pressed={isHindi}
        className={`px-2.5 py-1 rounded transition-colors ${
          isHindi
            ? 'bg-[#0A2540] text-white font-semibold shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};
