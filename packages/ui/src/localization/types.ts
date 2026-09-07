/**
 * @bhumitra/ui — Localization Types
 */

export type Locale = 'en' | 'hi';

export interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  isHindi: boolean;
}
