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

  // Sync with localStorage on client & listen to changes across tabs
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && (saved === 'en' || saved === 'hi')) {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'hi')) {
        setLocaleState(e.newValue as Locale);
        document.documentElement.lang = e.newValue;
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<Locale>;
      if (customEvent.detail && (customEvent.detail === 'en' || customEvent.detail === 'hi')) {
        setLocaleState(customEvent.detail);
        document.documentElement.lang = customEvent.detail;
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('bhumitra_locale_sync', handleCustomChange);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('bhumitra_locale_sync', handleCustomChange);
    };
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
      // Dispatch in current window for any non-React or sibling listeners
      window.dispatchEvent(new CustomEvent('bhumitra_locale_sync', { detail: newLocale }));
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
