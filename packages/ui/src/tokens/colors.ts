/**
 * @bhumitra/ui — Government of India Design System
 * Color Design Tokens
 * 
 * Combines Indian civic identity with modern high-contrast enterprise UX.
 * Complies with accessibility guidelines (WCAG 2.1 AA contrast ratio >= 4.5:1 for normal text).
 */

export const colors = {
  // National Identity & Civic Authority
  gov: {
    navyDark: '#061626',
    navy: '#0A2540',
    navyLight: '#1E3A5F',
    ashokaBlue: '#06038D',
    ashokaBlueLight: '#1A237E',
    ashokaBlueSubtle: '#E8EAF6',
  },

  // Indian Tricolor Accents (Restrained Civic Treatment)
  tricolor: {
    saffron: '#FF671F',
    saffronDark: '#D84315',
    saffronLight: '#FFE0B2',
    saffronSubtle: '#FFF8E1',
    green: '#046A38',
    greenDark: '#0B5325',
    greenLight: '#C8E6C9',
    greenSubtle: '#E8F5E9',
    white: '#FFFFFF',
    navy: '#06038D',
  },

  // Enterprise UI Neutrals (Slate / Cool Grey)
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // Semantic Intent Tokens
  semantic: {
    success: {
      default: '#046A38',
      dark: '#0B5325',
      light: '#E8F5E9',
      border: '#A5D6A7',
      text: '#1B5E20',
    },
    warning: {
      default: '#D97706',
      dark: '#B45309',
      light: '#FEF3C7',
      border: '#FDE68A',
      text: '#92400E',
    },
    error: {
      default: '#DC2626',
      dark: '#991B1B',
      light: '#FEE2E2',
      border: '#FECACA',
      text: '#7F1D1D',
    },
    info: {
      default: '#0284C7',
      dark: '#0369A1',
      light: '#E0F2FE',
      border: '#BAE6FD',
      text: '#0C4A6E',
    },
  },

  // Statutory Land Acquisition Status Colors
  status: {
    draft: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
    submitted: { bg: '#E0F2FE', text: '#0369A1', border: '#7DD3FC' },
    underReview: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
    section11Issued: { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
    objectionPending: { bg: '#FFEDD5', text: '#C2410C', border: '#FDBA74' },
    section19Declared: { bg: '#FCE7F3', text: '#9D174D', border: '#F472B6' },
    valuationInProgress: { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },
    awardDeclared: { bg: '#CCFBF1', text: '#115E59', border: '#5EEAD4' },
    disbursed: { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' },
    completed: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
    escalated: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
    overdue: { bg: '#FFE4E6', text: '#BE123C', border: '#FDA4AF' },
    onHold: { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  },

  // Surfaces & Backgrounds
  surface: {
    background: '#F8FAFC',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    subtle: '#F1F5F9',
    muted: '#E2E8F0',
    border: '#CBD5E1',
    borderLight: '#E2E8F0',
    focusRing: '#0A2540',
  },
} as const;

export type ColorTokens = typeof colors;
