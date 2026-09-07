/**
 * @bhumitra/ui — Government of India Design System
 * Spacing, Elevation, Radius, and Motion Design Tokens
 * 
 * Formal, restrained scale tailored for dense civic & administrative portals.
 */

export const spacing = {
  // 4px Base Grid
  px: '1px',
  0: '0px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',   // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
} as const;

export const radius = {
  none: '0px',
  sm: '2px',
  md: '4px', // Standard for inputs, buttons, badges
  lg: '6px', // Standard for cards, modals, tables
  xl: '8px',
  full: '9999px',
} as const;

export const elevation = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
  md: '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
  lg: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
  card: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
  modal: '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
} as const;

export const motion = {
  duration: {
    fast: '100ms',
    normal: '150ms',
    slow: '250ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
