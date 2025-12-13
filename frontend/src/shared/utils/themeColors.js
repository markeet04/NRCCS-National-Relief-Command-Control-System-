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
  
  // ==================== DARK MODE - NASA MISSION CONTROL DESIGN ====================
  // High-contrast, mission-critical design inspired by NASA, military command centers
  // Every color serves a functional purpose: urgency, hierarchy, and status at a glance
  return {
    // ==================== BASE LAYER - BACKGROUNDS ====================
    // Primary Background - Near-black main canvas
    pageBg: '#0a0a0a',
    background: '#0a0a0a',
    
    // Surface Colors - Glassmorphic cards & panels
    cardBg: 'rgba(255, 255, 255, 0.05)',
    cardBgHover: 'rgba(255, 255, 255, 0.08)',
    cardBgSolid: '#1a1a1a',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.1)',
    cardShadow: '0 4px 32px 0 rgba(0, 0, 0, 0.45)',
    cardHoverShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
    
    // Elevated surfaces - Modals, dropdowns, overlays
    elevatedBg: '#1a1a1a',
    elevatedBg2: '#2a2a2a',
    surfaceGray900: '#1a1a1a',
    
    // Pure black accents - Live status, mission clock
    black: '#000000',
    pureBlack: '#000000',
    
    // Glassmorphism effect
    glassBlur: 'backdrop-blur-md',
    glassBg: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    glassShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
    
    // ==================== TYPOGRAPHY - TEXT HIERARCHY ====================
    // Primary Text - Maximum readability for mission-critical info
    textPrimary: '#ffffff',
    
    // Secondary Text - Body text, descriptions
    textSecondary: '#d1d5db',
    
    // Tertiary Text - Timestamps, metadata, helper text
    textTertiary: '#9ca3af',
    
    // Muted Text - Disabled states, placeholders
    textMuted: '#6b7280',
    textPlaceholder: '#6b7280',
    
    // ==================== BRAND COLORS - PRIMARY ACTIONS ====================
    // Primary Green (Deep Emerald) - Military operational green
    brandPrimary: '#047857',
    brandPrimaryHover: '#065f46',
    primary: '#047857',
    primaryHover: '#065f46',
    primaryLight: 'rgba(4, 120, 87, 0.15)',
    
    // Accent Green (Bright Emerald) - Success, positive trends
    brandAccent: '#10b981',
    brandLight: '#16a34a',
    accent: '#10b981',
    
    // ==================== STATUS COLORS - SEVERITY SYSTEM ====================
    // Critical (Red) - Maximum urgency, emergency actions
    critical: '#ef4444',
    criticalHover: '#dc2626',
    criticalText: '#fca5a5',
    criticalBg: 'rgba(239, 68, 68, 0.2)',
    danger: '#ef4444',
    dangerHover: '#dc2626',
    dangerLight: 'rgba(239, 68, 68, 0.2)',
    
    // High Priority (Orange) - High urgency, warnings
    high: '#f59e0b',
    highHover: '#ea580c',
    highText: '#fb923c',
    highBg: 'rgba(245, 158, 11, 0.2)',
    warning: '#f59e0b',
    warningHover: '#ea580c',
    warningLight: 'rgba(245, 158, 11, 0.2)',
    
    // Medium Priority (Yellow) - Moderate urgency, advisories
    medium: '#eab308',
    mediumHover: '#ca8a04',
    mediumText: '#fde047',
    mediumBg: 'rgba(234, 179, 8, 0.2)',
    
    // Low Priority / Info (Blue) - Informational, non-urgent
    low: '#3b82f6',
    lowHover: '#2563eb',
    lowText: '#60a5fa',
    lowBg: 'rgba(59, 130, 246, 0.2)',
    info: '#3b82f6',
    infoHover: '#2563eb',
    infoLight: 'rgba(59, 130, 246, 0.2)',
    
    // Success / Operational (Emerald) - Positive status
    success: '#10b981',
    successHover: '#059669',
    successLight: 'rgba(16, 185, 129, 0.2)',
    successText: '#34d399',
    
    // ==================== BORDERS & DIVIDERS ====================
    // Subtle Borders - Glassmorphic design
    borderSubtle: 'rgba(255, 255, 255, 0.1)',
    
    // Medium Borders - Input fields, dropdowns
    borderMedium: '#374151',
    
    // Strong Borders - Modal borders, prominent dividers
    borderStrong: '#1f2937',
    
    // ==================== SPECIAL EFFECTS & OVERLAYS ====================
    // Glow Effects - Urgency indicators
    criticalGlow: '0 0 20px rgba(239, 68, 68, 0.5)',
    successGlow: '0 0 15px rgba(16, 185, 129, 0.3)',
    infoGlow: '0 0 15px rgba(59, 130, 246, 0.3)',
    warningGlow: '0 0 15px rgba(245, 158, 11, 0.3)',
    
    // Overlays - Modal backdrops, map overlays
    overlayDark: 'rgba(0, 0, 0, 0.6)',
    overlayDarker: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(255, 255, 255, 0.05)',
    overlayHover: 'rgba(255, 255, 255, 0.1)',
    
    // ==================== BUTTON STYLES ====================
    // Primary Button - Deep emerald green
    btnPrimaryBg: '#047857',
    btnPrimaryHover: '#065f46',
    btnPrimaryColor: '#ffffff',
    btnPrimaryShadow: '0 4px 14px rgba(4, 120, 87, 0.35)',
    btnPrimaryHoverShadow: '0 6px 20px rgba(4, 120, 87, 0.45)',
    
    // Accent Button - Bright emerald
    btnAccentBg: '#10b981',
    btnAccentHover: '#059669',
    btnAccentColor: '#ffffff',
    
    // Critical/Danger Button
    btnCriticalBg: '#ef4444',
    btnCriticalHover: '#dc2626',
    btnCriticalColor: '#ffffff',
    
    // Secondary Button
    btnSecondaryBg: 'rgba(255, 255, 255, 0.05)',
    btnSecondaryHover: 'rgba(255, 255, 255, 0.1)',
    btnSecondaryColor: '#d1d5db',
    btnSecondaryBorder: 'rgba(255, 255, 255, 0.1)',
    
    // Quick Action Buttons
    btnDeployBg: '#2563eb',
    btnDeployHover: '#3b82f6',
    btnEvacuateBg: '#dc2626',
    btnEvacuateHover: '#ef4444',
    btnBroadcastBg: '#ea580c',
    btnBroadcastHover: '#f59e0b',
    btnBackupBg: '#7c3aed',
    btnBackupHover: '#8b5cf6',
    btnCloseBg: '#374151',
    btnCloseHover: '#4b5563',
    btnShelterBg: '#059669',
    btnShelterHover: '#10b981',
    
    // ==================== INPUT/FORM STYLES ====================
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    inputFocusBorder: '#3b82f6',
    inputFocusRing: 'rgba(59, 130, 246, 0.2)',
    inputText: '#ffffff',
    
    // ==================== TABLE STYLES ====================
    tableHeaderBg: 'rgba(255, 255, 255, 0.02)',
    tableRowHoverBg: 'rgba(255, 255, 255, 0.04)',
    tableBorder: 'rgba(255, 255, 255, 0.1)',
    tableStripedBg: 'rgba(255, 255, 255, 0.02)',
    
    // ==================== MODAL STYLES ====================
    modalOverlay: 'rgba(0, 0, 0, 0.8)',
    modalBg: '#1a1a1a',
    modalBorder: 'rgba(255, 255, 255, 0.1)',
    modalShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    
    // ==================== SIDEBAR STYLES ====================
    sidebarBg: '#0a0a0a',
    sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    sidebarItemHover: 'rgba(255, 255, 255, 0.05)',
    sidebarItemActive: '#047857',
    sidebarItemActiveText: '#ffffff',
    sidebarItemText: '#9ca3af',
    
    // ==================== HEADER STYLES ====================
    headerBg: 'rgba(10, 10, 10, 0.95)',
    headerBorder: 'rgba(255, 255, 255, 0.1)',
    headerShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
    
    // ==================== LIVE STATUS BOARD (TOP TICKER) ====================
    statusBoardBg: '#000000',
    statusBoardBorder: '#374151',
    
    // ==================== WEATHER RADAR ====================
    radarBg: 'radial-gradient(circle, rgba(20, 83, 45, 0.2) 0%, #0a0a0a 100%)',
    radarRing: 'rgba(34, 197, 94, 0.2)',
    radarStorm: 'rgba(239, 68, 68, 0.3)',
    radarSweep: 'linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.3) 100%)',
    
    // ==================== COMMUNICATION LOG ====================
    commLogBg: 'rgba(0, 0, 0, 0.2)',
    commSentBg: 'rgba(30, 58, 138, 0.2)',
    commSentBorder: '#3b82f6',
    commReceivedBg: '#1f2937',
    commReceivedBorder: '#374151',
    commTeamColor: '#22c55e',
    commHQColor: '#60a5fa',
    
    // ==================== MISSION CLOCK ====================
    missionClockBg: '#000000',
    missionClockBorder: '#1f2937',
    missionTimeColor: '#60a5fa',
    
    // ==================== RESOURCE ALERTS ====================
    resourceAlertBg: 'rgba(17, 24, 39, 0.9)',
    resourceAlertBorder: '#ef4444',
    resourceCountdown: '#fb923c',
    
    // ==================== STAT CARD GRADIENTS ====================
    gradients: {
      // Critical/Danger - Red gradient
      critical: {
        bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        accent: '#fca5a5',
        iconBg: 'rgba(239, 68, 68, 0.15)',
        textColor: '#ffffff',
        borderTop: '#fca5a5',
        shadow: '0 4px 20px rgba(239, 68, 68, 0.35)'
      },
      red: {
        bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        accent: '#fca5a5',
        iconBg: 'rgba(239, 68, 68, 0.15)',
        textColor: '#ffffff',
        borderTop: '#fca5a5',
        shadow: '0 4px 20px rgba(239, 68, 68, 0.35)'
      },
      rose: {
        bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        accent: '#fca5a5',
        iconBg: 'rgba(239, 68, 68, 0.15)',
        textColor: '#ffffff',
        borderTop: '#fca5a5',
        shadow: '0 4px 20px rgba(239, 68, 68, 0.35)'
      },
      // Success/Operational - Emerald gradient
      success: {
        bg: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        accent: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.15)',
        textColor: '#ffffff',
        borderTop: '#10b981',
        shadow: '0 4px 20px rgba(16, 185, 129, 0.35)'
      },
      emerald: {
        bg: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        accent: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.15)',
        textColor: '#ffffff',
        borderTop: '#10b981',
        shadow: '0 4px 20px rgba(16, 185, 129, 0.35)'
      },
      // Info/Low - Blue gradient
      info: {
        bg: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        accent: '#60a5fa',
        iconBg: 'rgba(59, 130, 246, 0.15)',
        textColor: '#ffffff',
        borderTop: '#60a5fa',
        shadow: '0 4px 20px rgba(59, 130, 246, 0.35)'
      },
      blue: {
        bg: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        accent: '#60a5fa',
        iconBg: 'rgba(59, 130, 246, 0.15)',
        textColor: '#ffffff',
        borderTop: '#60a5fa',
        shadow: '0 4px 20px rgba(59, 130, 246, 0.35)'
      },
      violet: {
        bg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        accent: '#a78bfa',
        iconBg: 'rgba(139, 92, 246, 0.15)',
        textColor: '#ffffff',
        borderTop: '#a78bfa',
        shadow: '0 4px 20px rgba(139, 92, 246, 0.35)'
      },
      // Warning/High - Orange gradient
      warning: {
        bg: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
        accent: '#fb923c',
        iconBg: 'rgba(245, 158, 11, 0.15)',
        textColor: '#ffffff',
        borderTop: '#fb923c',
        shadow: '0 4px 20px rgba(245, 158, 11, 0.35)'
      },
      orange: {
        bg: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
        accent: '#fb923c',
        iconBg: 'rgba(245, 158, 11, 0.15)',
        textColor: '#ffffff',
        borderTop: '#fb923c',
        shadow: '0 4px 20px rgba(245, 158, 11, 0.35)'
      },
      amber: {
        bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        accent: '#fbbf24',
        iconBg: 'rgba(245, 158, 11, 0.15)',
        textColor: '#ffffff',
        borderTop: '#fbbf24',
        shadow: '0 4px 20px rgba(245, 158, 11, 0.35)'
      },
      // Medium - Yellow gradient
      medium: {
        bg: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
        accent: '#fde047',
        iconBg: 'rgba(234, 179, 8, 0.15)',
        textColor: '#ffffff',
        borderTop: '#fde047',
        shadow: '0 4px 20px rgba(234, 179, 8, 0.35)'
      },
      yellow: {
        bg: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
        accent: '#fde047',
        iconBg: 'rgba(234, 179, 8, 0.15)',
        textColor: '#ffffff',
        borderTop: '#fde047',
        shadow: '0 4px 20px rgba(234, 179, 8, 0.35)'
      },
      // Cyan/Teal variants
      cyan: {
        bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        accent: '#22d3ee',
        iconBg: 'rgba(6, 182, 212, 0.15)',
        textColor: '#ffffff',
        borderTop: '#22d3ee',
        shadow: '0 4px 20px rgba(6, 182, 212, 0.35)'
      },
      teal: {
        bg: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        accent: '#2dd4bf',
        iconBg: 'rgba(20, 184, 166, 0.15)',
        textColor: '#ffffff',
        borderTop: '#2dd4bf',
        shadow: '0 4px 20px rgba(20, 184, 166, 0.35)'
      },
      // Indigo variant
      indigo: {
        bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        accent: '#818cf8',
        iconBg: 'rgba(99, 102, 241, 0.15)',
        textColor: '#ffffff',
        borderTop: '#818cf8',
        shadow: '0 4px 20px rgba(99, 102, 241, 0.35)'
      },
      // Pink variant
      pink: {
        bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        accent: '#f472b6',
        iconBg: 'rgba(236, 72, 153, 0.15)',
        textColor: '#ffffff',
        borderTop: '#f472b6',
        shadow: '0 4px 20px rgba(236, 72, 153, 0.35)'
      }
    },
    
    // ==================== HELPER FUNCTIONS ====================
    getStatusBadge: (color) => ({
      background: `${color}33`,
      color: color,
      border: `1px solid ${color}55`
    }),
    getTag: (color) => ({
      background: `${color}22`,
      color: color,
      border: `1px solid ${color}44`
    }),
    
    // ==================== FONT SIZES (INCREASED FOR READABILITY) ====================
    fontSize: {
      xs: '13px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      statValue: '32px',
      statLabel: '14px',
      cardTitle: '18px',
      cardBody: '15px',
      tableHeader: '14px',
      tableCell: '15px',
    }
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
