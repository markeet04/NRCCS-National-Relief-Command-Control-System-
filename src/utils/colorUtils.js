/**
 * Color Utility Functions
 * Color manipulation and theme management utilities
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code
 * @returns {Object} RGB color object
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convert RGB to hex color
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color code
 */
export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Add opacity to hex color
 * @param {string} hex - Hex color code
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} RGBA color string
 */
export const addOpacity = (hex, opacity) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};

/**
 * Lighten a color
 * @param {string} hex - Hex color code
 * @param {number} amount - Amount to lighten (0-1)
 * @returns {string} Lightened hex color
 */
export const lighten = (hex, amount) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount));
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount));
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount));
  
  return rgbToHex(r, g, b);
};

/**
 * Darken a color
 * @param {string} hex - Hex color code
 * @param {number} amount - Amount to darken (0-1)
 * @returns {string} Darkened hex color
 */
export const darken = (hex, amount) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.max(0, Math.floor(rgb.r * (1 - amount)));
  const g = Math.max(0, Math.floor(rgb.g * (1 - amount)));
  const b = Math.max(0, Math.floor(rgb.b * (1 - amount)));
  
  return rgbToHex(r, g, b);
};

/**
 * Get contrast color (black or white) for background
 * @param {string} hex - Background hex color
 * @returns {string} Contrast color (#000000 or #ffffff)
 */
export const getContrastColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

/**
 * Generate color palette from base color
 * @param {string} baseColor - Base hex color
 * @param {number} steps - Number of palette steps
 * @returns {Array} Array of color variations
 */
export const generatePalette = (baseColor, steps = 5) => {
  const palette = [];
  const stepSize = 1 / (steps - 1);
  
  for (let i = 0; i < steps; i++) {
    const amount = i * stepSize;
    if (i < Math.floor(steps / 2)) {
      palette.push(darken(baseColor, amount * 0.6));
    } else if (i === Math.floor(steps / 2)) {
      palette.push(baseColor);
    } else {
      const lightenAmount = (i - Math.floor(steps / 2)) * stepSize;
      palette.push(lighten(baseColor, lightenAmount * 0.6));
    }
  }
  
  return palette;
};

/**
 * NDMA Theme Colors
 */
export const THEME_COLORS = {
  // Primary colors
  primary: '#0ea5e9',
  primaryDark: '#0284c7',
  primaryLight: '#38bdf8',
  
  // Secondary colors
  secondary: '#64748b',
  secondaryDark: '#475569',
  secondaryLight: '#94a3b8',
  
  // Status colors
  success: '#22c55e',
  successDark: '#16a34a',
  successLight: '#4ade80',
  
  warning: '#eab308',
  warningDark: '#ca8a04',
  warningLight: '#facc15',
  
  error: '#dc2626',
  errorDark: '#b91c1c',
  errorLight: '#ef4444',
  
  info: '#3b82f6',
  infoDark: '#2563eb',
  infoLight: '#60a5fa',
  
  // Severity colors
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#eab308',
  low: '#22c55e',
  
  // Background colors
  background: '#0f1629',
  backgroundSecondary: '#1a1f2e',
  backgroundTertiary: '#252d3d',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#e2e8f0',
  textMuted: '#94a3b8',
  
  // Border colors
  border: 'rgba(148, 163, 184, 0.08)',
  borderLight: 'rgba(148, 163, 184, 0.15)',
  borderDark: 'rgba(148, 163, 184, 0.05)'
};

/**
 * Get severity color
 * @param {string} severity - Severity level
 * @returns {string} Hex color for severity
 */
export const getSeverityColor = (severity) => {
  const severityColors = {
    critical: THEME_COLORS.critical,
    high: THEME_COLORS.high,
    medium: THEME_COLORS.medium,
    low: THEME_COLORS.low
  };
  
  return severityColors[severity] || THEME_COLORS.medium;
};

/**
 * Get status color
 * @param {string} status - Status value
 * @returns {string} Hex color for status
 */
export const getStatusColor = (status) => {
  const statusColors = {
    active: THEME_COLORS.error,
    resolved: THEME_COLORS.success,
    pending: THEME_COLORS.warning,
    available: THEME_COLORS.success,
    allocated: THEME_COLORS.info,
    critical: THEME_COLORS.error,
    maintenance: THEME_COLORS.secondary
  };
  
  return statusColors[status] || THEME_COLORS.secondary;
};

/**
 * Generate CSS variables for theme
 * @param {Object} colors - Color object
 * @returns {string} CSS variables string
 */
export const generateCSSVariables = (colors = THEME_COLORS) => {
  return Object.entries(colors)
    .map(([key, value]) => `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
    .join('\n');
};

/**
 * Color interpolation between two colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {string} Interpolated hex color
 */
export const interpolateColor = (color1, color2, factor) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
  const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
  const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
  
  return rgbToHex(r, g, b);
};

/**
 * Generate gradient CSS
 * @param {Array} colors - Array of colors
 * @param {string} direction - Gradient direction
 * @returns {string} CSS gradient string
 */
export const generateGradient = (colors, direction = 'to right') => {
  if (colors.length < 2) return colors[0] || '#000000';
  
  const stops = colors.map((color, index) => {
    const position = (index / (colors.length - 1)) * 100;
    return `${color} ${position}%`;
  }).join(', ');
  
  return `linear-gradient(${direction}, ${stops})`;
};

/**
 * Color accessibility checker
 * @param {string} foreground - Foreground color hex
 * @param {string} background - Background color hex
 * @returns {Object} Accessibility information
 */
export const checkColorAccessibility = (foreground, background) => {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  
  if (!fgRgb || !bgRgb) return { ratio: 0, level: 'fail' };
  
  // Calculate relative luminance
  const luminance = (rgb) => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const fgLum = luminance(fgRgb);
  const bgLum = luminance(bgRgb);
  
  const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  
  let level = 'fail';
  if (ratio >= 7) level = 'AAA';
  else if (ratio >= 4.5) level = 'AA';
  else if (ratio >= 3) level = 'AA-large';
  
  return { ratio: Math.round(ratio * 100) / 100, level };
};

export default {
  hexToRgb,
  rgbToHex,
  addOpacity,
  lighten,
  darken,
  getContrastColor,
  generatePalette,
  getSeverityColor,
  getStatusColor,
  generateCSSVariables,
  interpolateColor,
  generateGradient,
  checkColorAccessibility,
  THEME_COLORS
};