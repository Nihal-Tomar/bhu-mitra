/**
 * @bhumitra/ui — Government of India Design System
 * Typography Design Tokens
 * 
 * Configured for dual Latin (English) and Devanagari (Hindi) typography.
 * Line heights are augmented to ensure diacritics (matras) and ascenders/descenders
 * do not clip in complex Devanagari scripts.
 */

export const typography = {
  fontFamilies: {
    sans: 'var(--font-sans, "Noto Sans Devanagari", "Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    heading: 'var(--font-heading, "Noto Sans Devanagari", "Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    mono: 'var(--font-mono, "JetBrains Mono", "Courier New", Courier, monospace)',
    hindi: '"Noto Sans Devanagari", "Mangal", "Kohinoor Devanagari", sans-serif',
  },

  // Scale with generous line-height for bilingual legibility
  scale: {
    display: {
      fontSize: '2.25rem', // 36px
      lineHeight: '2.75rem', // 44px
      fontWeight: '700',
      letterSpacing: '-0.025em',
    },
    h1: {
      fontSize: '1.875rem', // 30px
      lineHeight: '2.375rem', // 38px
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.5rem', // 24px
      lineHeight: '2rem', // 32px
      fontWeight: '600',
      letterSpacing: '-0.015em',
    },
    h3: {
      fontSize: '1.25rem', // 20px
      lineHeight: '1.75rem', // 28px
      fontWeight: '600',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.625rem', // 26px
      fontWeight: '600',
    },
    bodyLarge: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5rem', // 24px
      fontWeight: '400',
    },
    body: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.375rem', // 22px
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: '0.8125rem', // 13px
      lineHeight: '1.25rem', // 20px
      fontWeight: '400',
    },
    label: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.25rem', // 20px
      fontWeight: '500',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1.125rem', // 18px
      fontWeight: '500',
    },
    tableHeader: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1rem', // 16px
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
    numeric: {
      fontFamily: 'var(--font-mono, monospace)',
      fontVariantNumeric: 'tabular-nums',
      fontWeight: '600',
    },
    kpi: {
      fontSize: '2rem', // 32px
      lineHeight: '2.5rem',
      fontWeight: '700',
      fontVariantNumeric: 'tabular-nums',
    },
  },
} as const;

export type TypographyTokens = typeof typography;
