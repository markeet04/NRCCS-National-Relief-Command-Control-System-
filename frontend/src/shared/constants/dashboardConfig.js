/**
 * Dashboard Configuration Constants
 * Centralized configuration for all dashboard roles (NDMA, PDMA, District, SuperAdmin)
 * Following the District dashboard pattern for consistency
 */

// =============================================================================
// MENU ITEMS - Sidebar navigation for each role
// =============================================================================

export const NDMA_MENU_ITEMS = [
  { route: 'dashboard', label: 'National Dashboard', icon: 'dashboard' },
  { route: 'alerts', label: 'Nationwide Alerts', icon: 'alerts' },
  { route: 'resources', label: 'Resource Allocation', icon: 'resources' },
  { route: 'map', label: 'Flood Map', icon: 'map' },
];

export const PDMA_MENU_ITEMS = [
  { route: 'dashboard', label: 'Provincial Dashboard', icon: 'dashboard' },
  { route: 'resources', label: 'Resource Distribution', icon: 'resources' },
  { route: 'shelters', label: 'Shelter Management', icon: 'map' },
  { route: 'districts', label: 'District Coordination', icon: 'alerts' },
  { route: 'map', label: 'Provincial Map', icon: 'map' },
];

export const DISTRICT_MENU_ITEMS = [
  { route: 'dashboard', label: 'District Dashboard', icon: 'dashboard' },
  { route: 'sos', label: 'SOS Requests', icon: 'alerts' },
  { route: 'shelters', label: 'Shelter Management', icon: 'resources' },
  { route: 'rescue', label: 'Rescue Teams', icon: 'resources' },
  { route: 'resources', label: 'Resource Distribution', icon: 'resources' },
  { route: 'reports', label: 'Damage Reports', icon: 'map' },
];

export const SUPERADMIN_MENU_ITEMS = [
  { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { route: 'users', label: 'User Management', icon: 'users' },
  { route: 'provinces', label: 'Provinces & Districts', icon: 'provinces' },
];

// Get menu items by role
export const getMenuItemsByRole = (role, badgeCount = 0) => {
  const menuMap = {
    ndma: NDMA_MENU_ITEMS.map(item => 
      item.route === 'alerts' ? { ...item, badge: badgeCount } : item
    ),
    pdma: PDMA_MENU_ITEMS,
    district: DISTRICT_MENU_ITEMS,
    superadmin: SUPERADMIN_MENU_ITEMS,
  };
  return menuMap[role?.toLowerCase()] || [];
};

// =============================================================================
// STAT GRADIENT KEYS - Consistent gradient mapping across all dashboards
// =============================================================================

export const STAT_GRADIENT_KEYS = {
  // Semantic keys
  danger: 'rose',
  success: 'emerald',
  info: 'violet',
  warning: 'amber',
  primary: 'blue',
  default: 'cyan',
  
  // Named stat types
  emergencies: 'rose',
  alerts: 'amber',
  teams: 'blue',
  shelters: 'emerald',
  resources: 'violet',
  population: 'cyan',
  sos: 'rose',
  capacity: 'violet',
  reports: 'cyan',
  users: 'emerald',
  uptime: 'violet',
  api: 'blue',
};

// =============================================================================
// STATUS COLORS - Common status color mapping
// =============================================================================

export const STATUS_COLORS = {
  // Alert/SOS statuses
  pending: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  active: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  assigned: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' },
  'en-route': { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
  resolved: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
  rescued: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
  
  // Resource statuses
  available: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
  low: { bg: 'rgba(251, 191, 36, 0.2)', text: '#f59e0b' },
  critical: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  sufficient: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
  
  // Team statuses
  on_mission: { bg: 'rgba(251, 191, 36, 0.2)', text: '#f59e0b' },
  standby: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
  unavailable: { bg: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' },
  
  // Default
  default: { bg: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' },
};

// Get status color helper
export const getStatusColor = (status) => {
  return STATUS_COLORS[status?.toLowerCase()] || STATUS_COLORS.default;
};

// =============================================================================
// SEVERITY LEVELS - For alerts and damage reports
// =============================================================================

export const SEVERITY_LEVELS = {
  critical: { label: 'Critical', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)', priority: 1 },
  high: { label: 'High', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', priority: 2 },
  medium: { label: 'Medium', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)', priority: 3 },
  low: { label: 'Low', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)', priority: 4 },
};

// =============================================================================
// ROLE CONFIGURATION - Default role info
// =============================================================================

export const ROLE_CONFIG = {
  ndma: {
    title: 'National Rescue & Crisis Coordination System',
    subtitle: 'Real-time national disaster management dashboard',
    userRole: 'NDMA',
    userName: 'Admin',
    basePath: '/ndma',
  },
  pdma: {
    title: 'Provincial Disaster Management',
    subtitle: 'Provincial coordination and resource management',
    userRole: 'PDMA',
    userName: 'Provincial Admin',
    basePath: '/pdma',
  },
  district: {
    title: 'District Operations Center',
    subtitle: 'Ground-level disaster response coordination',
    userRole: 'District',
    userName: 'District Officer',
    basePath: '/district',
  },
  superadmin: {
    title: 'Super Admin Dashboard',
    subtitle: 'System-wide management and configuration',
    userRole: 'Super Admin',
    userName: 'Admin',
    basePath: '/admin',
    menuItems: SUPERADMIN_MENU_ITEMS,
  },
};

// =============================================================================
// COMMON CARD STYLES - Consistent styling helpers
// =============================================================================

export const getCardStyle = (colors, isLight) => ({
  background: colors.cardBg,
  border: `1px solid ${colors.cardBorder}`,
  borderRadius: '12px',
  padding: '20px',
  boxShadow: isLight ? colors.cardShadow : 'none',
});

export const getSectionHeaderStyle = (colors) => ({
  fontSize: '18px',
  fontWeight: '600',
  color: colors.textPrimary,
  marginBottom: '16px',
});

// =============================================================================
// WEATHER DATA STRUCTURE (shared across dashboards)
// =============================================================================

export const DEFAULT_WEATHER_DATA = [
  { label: 'Rainfall', value: 'Heavy', icon: 'droplets' },
  { label: 'Wind Speed', value: '45 km/h', icon: 'wind' },
  { label: 'Temperature', value: '28°C', icon: 'thermometer' },
  { label: 'Humidity', value: '85%', icon: 'droplet' },
];

// =============================================================================
// RESOURCE CATEGORIES
// =============================================================================

export const RESOURCE_CATEGORIES = [
  { id: 'food', name: 'Food Packets', icon: '🍱', unit: 'packets' },
  { id: 'water', name: 'Water Bottles', icon: '💧', unit: 'bottles' },
  { id: 'tents', name: 'Tents', icon: '⛺', unit: 'units' },
  { id: 'medical', name: 'Medical Kits', icon: '⚕️', unit: 'kits' },
  { id: 'blankets', name: 'Blankets', icon: '🛏️', unit: 'pieces' },
];

// =============================================================================
// PROVINCES DATA
// =============================================================================

export const PROVINCES = [
  { name: 'Punjab', code: 'PB' },
  { name: 'Sindh', code: 'SD' },
  { name: 'Khyber Pakhtunkhwa', code: 'KP' },
  { name: 'Balochistan', code: 'BL' },
];

// =============================================================================
// DASHBOARD LAYOUT PROPS HELPER - Get consistent layout props by role
// =============================================================================

/**
 * Get dashboard layout props for a specific role
 * @param {string} role - User role (ndma, pdma, district, superadmin)
 * @param {object} options - Additional options
 * @param {number} options.badgeCount - Badge count for alerts menu item
 * @param {string} options.activeRoute - Current active route
 * @param {function} options.onNavigate - Navigation handler
 * @returns {object} Props to spread into DashboardLayout
 */
export const getDashboardLayoutProps = (role, options = {}) => {
  const { badgeCount = 0, activeRoute = 'dashboard', onNavigate } = options;
  const roleConfig = ROLE_CONFIG[role?.toLowerCase()] || ROLE_CONFIG.ndma;
  const menuItems = getMenuItemsByRole(role, badgeCount);
  
  return {
    menuItems,
    activeRoute,
    onNavigate: onNavigate || (() => {}),
    userRole: roleConfig.userRole,
    userName: roleConfig.userName,
    pageTitle: roleConfig.title,
    pageSubtitle: roleConfig.subtitle,
  };
};

// =============================================================================
// TEAM STATUS OPTIONS
// =============================================================================

export const TEAM_STATUS = {
  available: { label: 'Available', color: '#22c55e' },
  busy: { label: 'On Mission', color: '#f59e0b' },
  unavailable: { label: 'Unavailable', color: '#ef4444' },
};

// =============================================================================
// SHELTER STATUS OPTIONS  
// =============================================================================

export const SHELTER_STATUS = {
  available: { label: 'Available', color: '#22c55e' },
  full: { label: 'Full', color: '#ef4444' },
  limited: { label: 'Limited', color: '#f59e0b' },
};

// =============================================================================
// SOS STATUS OPTIONS
// =============================================================================

export const SOS_STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'En-route', label: 'En-route' },
  { value: 'Rescued', label: 'Rescued' },
];
