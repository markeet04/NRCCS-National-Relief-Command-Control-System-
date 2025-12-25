/**
 * District Module Constants
 * Centralized constants for the District dashboard feature
 * Easy to modify when connecting to backend
 */

// Menu items for district sidebar navigation
export const DISTRICT_MENU_ITEMS = [
  { route: 'dashboard', label: 'District Dashboard', icon: 'dashboard' },
  { route: 'sos', label: 'SOS Requests', icon: 'alerts' },
  { route: 'shelters', label: 'Shelter Management', icon: 'resources' },
  { route: 'rescue', label: 'Rescue Teams', icon: 'resources' },
  { route: 'resources', label: 'Resource Distribution', icon: 'resources' },
  { route: 'reports', label: 'Damage Reports', icon: 'map' },
  { route: 'missing-persons', label: 'Missing Persons', icon: 'search' },
];

// SOS Request status options (for dropdowns)
export const SOS_STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'En-route', label: 'En-route' },
  { value: 'Rescued', label: 'Rescued' },
];

// Status color mapping
export const STATUS_COLORS = {
  pending: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  assigned: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' },
  'en-route': { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
  rescued: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
  default: { bg: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' },
};

// Stat card gradient keys mapping
export const STAT_GRADIENT_KEYS = {
  // Semantic keys (used in pages)
  danger: 'rose',
  success: 'emerald',
  info: 'violet',
  warning: 'amber',
  default: 'cyan',
  // Named keys (alternative)
  pendingSOS: 'rose',
  activeShelters: 'emerald',
  shelterCapacity: 'violet',
  rescueTeams: 'blue',
  localResources: 'amber',
  damageReports: 'cyan',
};

// Team status options
export const TEAM_STATUS = {
  available: { label: 'Available', color: '#22c55e' },
  busy: { label: 'On Mission', color: '#f59e0b' },
  unavailable: { label: 'Unavailable', color: '#ef4444' },
};

// Shelter status options
export const SHELTER_STATUS = {
  available: { label: 'Available', color: '#22c55e' },
  full: { label: 'Full', color: '#ef4444' },
  limited: { label: 'Limited', color: '#f59e0b' },
};

// Damage report severity levels
export const DAMAGE_SEVERITY = {
  critical: { label: 'Critical', color: '#ef4444', priority: 1 },
  high: { label: 'High', color: '#f59e0b', priority: 2 },
  medium: { label: 'Medium', color: '#3b82f6', priority: 3 },
  low: { label: 'Low', color: '#22c55e', priority: 4 },
};

// Table column definitions for SOS requests
export const SOS_TABLE_COLUMNS = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'people', label: 'People', sortable: true },
  { key: 'time', label: 'Time', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
];

// Default district info (will come from auth context later)
export const DEFAULT_DISTRICT_INFO = {
  name: 'Sukkur',
  province: 'Sindh',
  role: 'District Officer',
};

// Resource distribution filters for district
export const RESOURCE_DISTRIBUTION_FILTERS = ['all', 'available', 'allocated', 'low', 'critical'];

// Resource status colors
export const RESOURCE_STATUS_COLORS = {
  available: { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' },
  allocated: { bg: '#3b82f6', light: 'rgba(59, 130, 246, 0.1)' },
  low: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
  critical: { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
};
