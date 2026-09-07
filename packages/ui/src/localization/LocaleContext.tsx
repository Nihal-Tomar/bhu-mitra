'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Locale, LocaleContextType } from './types';
import { dictionary } from './dictionary';

const LocaleContext = createContext<LocaleContextType | null>(null);

const STORAGE_KEY = 'bhumitra_user_locale';

export interface LocaleProviderProps {
  children: React.ReactNode;
  defaultLocale?: Locale;
}

export function LocaleProvider({ children, defaultLocale = 'en' }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Sync with localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && (saved === 'en' || saved === 'hi')) {
        setLocaleState(saved);
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // Ignore localStorage write errors
    }
  };

  const t = useMemo(() => {
    return (key: string, fallback?: string): string => {
      const currentDict = dictionary[locale] || dictionary.en;
      if (currentDict && currentDict[key]) {
        return currentDict[key];
      }
      // Fallback to English dictionary if key missing in target language
      if (dictionary.en && dictionary.en[key]) {
        return dictionary.en[key];
      }
      return fallback || key;
    };
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      isHindi: locale === 'hi',
    }),
    [locale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    // Graceful fallback if used outside of LocaleProvider
    return {
      locale: 'en',
      setLocale: () => {},
      t: (key: string, fallback?: string) => dictionary.en[key] || fallback || key,
      isHindi: false,
    };
  }
  return context;
}
