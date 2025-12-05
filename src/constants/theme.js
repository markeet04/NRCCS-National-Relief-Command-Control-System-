/**
 * Design System - Color Palette and Theme Configuration
 * Centralized theme tokens for consistent UI across all dashboards
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Sidebar - Deep Forest Green
  sidebar: {
    bg: '#0a3d0a',        // Deep green
    hover: '#0d4f0d',     // Lighter green on hover
    active: '#116611',    // Active state
    text: '#ffffff',
    textMuted: '#a3d9a5',
  },

  // Background Colors
  background: {
    main: '#f8fafc',      // Light gray-blue
    dark: '#1e293b',      // Dark slate
    darker: '#0f172a',    // Darker slate for cards
    card: '#ffffff',
    overlay: 'rgba(15, 23, 42, 0.7)',
  },

  // Status Colors
  status: {
    critical: {
      bg: '#fee2e2',
      text: '#991b1b',
      border: '#fca5a5',
      solid: '#dc2626',
    },
    high: {
      bg: '#fed7aa',
      text: '#9a3412',
      border: '#fdba74',
      solid: '#ea580c',
    },
    medium: {
      bg: '#fef3c7',
      text: '#92400e',
      border: '#fcd34d',
      solid: '#f59e0b',
    },
    low: {
      bg: '#dbeafe',
      text: '#1e40af',
      border: '#93c5fd',
      solid: '#3b82f6',
    },
    success: {
      bg: '#d1fae5',
      text: '#065f46',
      border: '#6ee7b7',
      solid: '#10b981',
    },
    active: {
      bg: '#e0e7ff',
      text: '#3730a3',
      border: '#a5b4fc',
      solid: '#6366f1',
    },
  },

  // Neutral Colors
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Alert Colors
  alert: {
    error: '#dc2626',
    warning: '#f59e0b',
    info: '#0ea5e9',
    success: '#10b981',
  },
};

export const spacing = {
  sidebar: '256px',
  header: '64px',
  cardPadding: '24px',
  sectionGap: '24px',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  card: '0 4px 12px rgba(15, 23, 42, 0.08)',
  cardHover: '0 8px 24px rgba(15, 23, 42, 0.12)',
};

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  transitions,
};
