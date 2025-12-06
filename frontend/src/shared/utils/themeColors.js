/**
 * Global Theme Color Scheme
 * Centralized color definitions for all dashboards (District, PDMA, NDMA, SuperAdmin)
 * This file provides consistent light mode colors across the entire application
 * Dark mode remains unchanged and uses its original styling
 */

/**
 * Get theme colors based on current theme mode
 * @param {boolean} isLight - Whether the current theme is light mode
 * @returns {Object} Color scheme object
 */
export const getThemeColors = (isLight) => {
  if (isLight) {
    return {
      // ==================== BACKGROUNDS ====================
      // Main page background - subtle warm gradient feel
      pageBg: '#f8fafc',
      background: '#f1f5f9',
      
      // Card backgrounds - clean with subtle depth
      cardBg: '#ffffff',
      cardBgHover: '#fafbfc',
      cardBorder: '#e2e8f0',
      border: '#e2e8f0',
      cardShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
      cardHoverShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      
      // ==================== TEXT COLORS ====================
      textPrimary: '#1e293b',      // Rich slate - softer than pure black
      textSecondary: '#475569',    // Medium slate for body
      textMuted: '#64748b',        // Muted for labels
      textPlaceholder: '#94a3b8',  // Light for placeholders
      
      // ==================== PRIMARY COLORS - Vibrant Blue ====================
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      primaryLight: 'rgba(37, 99, 235, 0.08)',
      
      // ==================== STATUS COLORS - Vivid & Clear ====================
      success: '#059669',
      successLight: 'rgba(5, 150, 105, 0.08)',
      successBorder: 'rgba(5, 150, 105, 0.2)',
      
      warning: '#d97706',
      warningLight: 'rgba(217, 119, 6, 0.08)',
      warningBorder: 'rgba(217, 119, 6, 0.2)',
      
      danger: '#dc2626',
      dangerLight: 'rgba(220, 38, 38, 0.08)',
      dangerBorder: 'rgba(220, 38, 38, 0.2)',
      
      info: '#0284c7',
      infoLight: 'rgba(2, 132, 199, 0.08)',
      infoBorder: 'rgba(2, 132, 199, 0.2)',
      
      // ==================== ICON STYLES ====================
      iconBg: 'rgba(37, 99, 235, 0.08)',
      iconColor: '#2563eb',
      iconMuted: '#94a3b8',
      
      // ==================== INPUT/FORM STYLES ====================
      inputBg: '#ffffff',
      inputBorder: '#d1d5db',
      inputFocusBorder: '#2563eb',
      inputFocusRing: 'rgba(37, 99, 235, 0.15)',
      
      // ==================== TABLE STYLES ====================
      tableHeaderBg: '#f8fafc',
      tableRowHoverBg: '#f1f5f9',
      tableBorder: '#e5e7eb',
      
      // ==================== MODAL STYLES ====================
      modalOverlay: 'rgba(15, 23, 42, 0.6)',
      modalBg: '#ffffff',
      modalBorder: '#e2e8f0',
      modalShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      
      // ==================== BUTTON STYLES ====================
      btnPrimaryBg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      btnPrimaryColor: '#ffffff',
      btnPrimaryShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
      btnPrimaryHoverShadow: '0 6px 20px rgba(37, 99, 235, 0.45)',
      
      btnSecondaryBg: '#f1f5f9',
      btnSecondaryColor: '#475569',
      btnSecondaryBorder: '#e2e8f0',
      
      btnSuccessBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      btnSuccessColor: '#ffffff',
      btnSuccessShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
      
      btnDangerBg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      btnDangerColor: '#ffffff',
      btnDangerShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
      
      // ==================== STAT CARD GRADIENTS ====================
      // Bold solid colors matching dark mode style - vibrant backgrounds with white text
      gradients: {
        // Pending SOS - Bold Red/Rose
        rose: { 
          bg: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', 
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#fb7185',
          shadow: '0 4px 20px rgba(244, 63, 94, 0.35)'
        },
        // Active Shelters - Bold Green/Emerald
        emerald: { 
          bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#34d399',
          shadow: '0 4px 20px rgba(16, 185, 129, 0.35)'
        },
        // Shelter Capacity - Bold Purple/Violet
        violet: { 
          bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#a78bfa',
          shadow: '0 4px 20px rgba(139, 92, 246, 0.35)'
        },
        // Rescue Teams Active - Bold Blue
        blue: { 
          bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#60a5fa',
          shadow: '0 4px 20px rgba(59, 130, 246, 0.35)'
        },
        // Local Resources - Bold Orange/Amber
        amber: { 
          bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#fbbf24',
          shadow: '0 4px 20px rgba(245, 158, 11, 0.35)'
        },
        // Damage Reports - Bold Cyan/Teal
        cyan: { 
          bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', 
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#22d3ee',
          shadow: '0 4px 20px rgba(6, 182, 212, 0.35)'
        },
        // Yellow variant
        yellow: { 
          bg: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', 
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#facc15',
          shadow: '0 4px 20px rgba(234, 179, 8, 0.35)'
        },
        // Orange variant
        orange: {
          bg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#fb923c',
          shadow: '0 4px 20px rgba(249, 115, 22, 0.35)'
        },
        // Teal variant
        teal: {
          bg: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#2dd4bf',
          shadow: '0 4px 20px rgba(20, 184, 166, 0.35)'
        },
        // Indigo variant
        indigo: {
          bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#818cf8',
          shadow: '0 4px 20px rgba(99, 102, 241, 0.35)'
        },
        // Pink variant
        pink: {
          bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
          accent: '#ffffff',
          iconBg: 'rgba(255, 255, 255, 0.2)',
          textColor: '#ffffff',
          borderTop: '#f472b6',
          shadow: '0 4px 20px rgba(236, 72, 153, 0.35)'
        }
      },
      
      // ==================== DROPDOWN STYLES ====================
      dropdownBg: '#ffffff',
      dropdownBorder: '#e2e8f0',
      dropdownShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      dropdownHoverBg: '#f1f5f9',
      
      // ==================== PROGRESS BAR ====================
      progressBg: '#e2e8f0',
      progressFill: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
      
      // ==================== SCROLLBAR ====================
      scrollbarTrack: '#f1f5f9',
      scrollbarThumb: '#cbd5e1',
      scrollbarThumbHover: '#94a3b8',
      
      // ==================== SIDEBAR ====================
      sidebarBg: '#ffffff',
      sidebarBorder: '#e2e8f0',
      sidebarItemHover: '#f1f5f9',
      sidebarItemActive: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      sidebarItemActiveText: '#ffffff',
      sidebarItemText: '#334155',
      
      // ==================== HEADER ====================
      headerBg: '#ffffff',
      headerBorder: '#e2e8f0',
      headerShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      
      // ==================== HELPER FUNCTIONS ====================
      // Get status badge styling based on color
      getStatusBadge: (color) => ({
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`
      }),
      
      // Get tag/chip styling
      getTag: (color) => ({
        background: `${color}10`,
        color: color,
        border: `1px solid ${color}20`
      }),
    };
  }
  
  // ==================== DARK MODE (unchanged) ====================
  return {
    pageBg: 'transparent',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    cardBgHover: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    cardShadow: 'none',
    cardHoverShadow: 'none',
    
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    textPlaceholder: 'rgba(255, 255, 255, 0.4)',
    
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    primaryLight: 'rgba(59, 130, 246, 0.2)',
    
    success: '#10b981',
    successLight: 'rgba(16, 185, 129, 0.2)',
    successBorder: 'rgba(16, 185, 129, 0.3)',
    
    warning: '#f59e0b',
    warningLight: 'rgba(245, 158, 11, 0.2)',
    warningBorder: 'rgba(245, 158, 11, 0.3)',
    
    danger: '#ef4444',
    dangerLight: 'rgba(239, 68, 68, 0.2)',
    dangerBorder: 'rgba(239, 68, 68, 0.3)',
    
    info: '#3b82f6',
    infoLight: 'rgba(59, 130, 246, 0.2)',
    infoBorder: 'rgba(59, 130, 246, 0.3)',
    
    iconBg: 'transparent',
    iconColor: 'rgba(255, 255, 255, 0.4)',
    iconMuted: 'rgba(255, 255, 255, 0.4)',
    
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    inputFocusBorder: '#3b82f6',
    inputFocusRing: 'rgba(59, 130, 246, 0.2)',
    
    tableHeaderBg: 'transparent',
    tableRowHoverBg: 'rgba(255, 255, 255, 0.02)',
    tableBorder: 'rgba(255, 255, 255, 0.1)',
    
    modalOverlay: 'rgba(0, 0, 0, 0.7)',
    modalBg: '#1e293b',
    modalBorder: 'rgba(255, 255, 255, 0.1)',
    modalShadow: 'none',
    
    btnPrimaryBg: '#10b981',
    btnPrimaryColor: '#ffffff',
    btnPrimaryShadow: 'none',
    btnPrimaryHoverShadow: 'none',
    
    btnSecondaryBg: 'rgba(255, 255, 255, 0.05)',
    btnSecondaryColor: '#ffffff',
    btnSecondaryBorder: 'rgba(255, 255, 255, 0.2)',
    
    btnSuccessBg: '#10b981',
    btnSuccessColor: '#ffffff',
    btnSuccessShadow: 'none',
    
    btnDangerBg: '#ef4444',
    btnDangerColor: '#ffffff',
    btnDangerShadow: 'none',
    
    gradients: null, // Dark mode doesn't use gradient stat cards
    
    dropdownBg: '#1e293b',
    dropdownBorder: 'rgba(255, 255, 255, 0.1)',
    dropdownShadow: 'none',
    dropdownHoverBg: 'rgba(255, 255, 255, 0.1)',
    
    progressBg: 'rgba(255, 255, 255, 0.1)',
    progressFill: '#3b82f6',
    
    scrollbarTrack: 'rgba(255, 255, 255, 0.05)',
    scrollbarThumb: 'rgba(255, 255, 255, 0.2)',
    scrollbarThumbHover: 'rgba(255, 255, 255, 0.3)',
    
    sidebarBg: 'transparent',
    sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    sidebarItemHover: 'rgba(255, 255, 255, 0.1)',
    sidebarItemActive: '#3b82f6',
    sidebarItemActiveText: '#ffffff',
    sidebarItemText: 'rgba(255, 255, 255, 0.7)',
    
    headerBg: 'transparent',
    headerBorder: 'rgba(255, 255, 255, 0.1)',
    headerShadow: 'none',
    
    getStatusBadge: (color) => ({
      background: color,
      color: '#ffffff',
      border: 'none'
    }),
    
    getTag: (color) => ({
      background: `${color}30`,
      color: '#ffffff',
      border: 'none'
    }),
  };
};

// ==================== STATUS COLOR MAPPING ====================
export const STATUS_COLORS = {
  // SOS statuses
  Pending: '#ef4444',
  pending: '#ef4444',
  Assigned: '#10b981',
  assigned: '#10b981',
  'En-route': '#3b82f6',
  'en-route': '#3b82f6',
  Rescued: '#22c55e',
  rescued: '#22c55e',
  
  // Shelter statuses
  available: '#10b981',
  Available: '#10b981',
  'near-full': '#f59e0b',
  'Near Full': '#f59e0b',
  full: '#ef4444',
  Full: '#ef4444',
  
  // Team statuses
  deployed: '#f59e0b',
  'on-mission': '#fbbf24',
  unavailable: '#ef4444',
  active: '#10b981',
  Active: '#10b981',
  inactive: '#6b7280',
  Inactive: '#6b7280',
  
  // Report statuses
  verified: '#10b981',
  Verified: '#10b981',
  unverified: '#f59e0b',
  Unverified: '#f59e0b',
  
  // Priority levels
  critical: '#ef4444',
  Critical: '#ef4444',
  high: '#f97316',
  High: '#f97316',
  medium: '#f59e0b',
  Medium: '#f59e0b',
  low: '#10b981',
  Low: '#10b981',
  
  // General
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

/**
 * Get status color for any status string
 * @param {string} status - Status string
 * @returns {string} Hex color code
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || STATUS_COLORS[status?.toLowerCase()] || '#6b7280';
};

/**
 * Custom hook-ready theme getter
 * Usage: const colors = useThemeColors(theme === 'light')
 */
export const useThemeColors = (isLight) => getThemeColors(isLight);

export default getThemeColors;
