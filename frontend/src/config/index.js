/**
 * Application Configuration
 * Main entry point for all config exports
 */

// Re-export all configurations
export * from './constants';
export * from './theme';
export * from './roles';
export * from './mockData';

// Application Information
export const APP_CONFIG = {
  name: 'NRCCS',
  fullName: 'National Relief Command & Control System',
  version: '1.0.0',
  description: 'Pakistan National Disaster Management System',
  author: 'NDMA Pakistan',
  supportEmail: 'support@ndma.gov.pk',
  emergencyContact: '+92-51-9261334'
};

// User Roles and Permissions
export const USER_ROLES = {
  NDMA: {
    id: 'ndma',
    name: 'National Disaster Management Authority',
    level: 'National',
    permissions: [
      'view_all_data',
      'create_national_alerts',
      'manage_resources',
      'coordinate_provinces',
      'access_analytics',
      'manage_users',
      'system_settings'
    ]
  },
  PDMA: {
    id: 'pdma',
    name: 'Provincial Disaster Management Authority',
    level: 'Provincial',
    permissions: [
      'view_province_data',
      'create_provincial_alerts',
      'manage_local_resources',
      'coordinate_districts',
      'report_to_ndma'
    ]
  },
  DISTRICT: {
    id: 'district',
    name: 'District Administration',
    level: 'District',
    permissions: [
      'view_district_data',
      'manage_shelters',
      'handle_sos_requests',
      'report_to_pdma'
    ]
  }
};

// Alert Configurations
export const ALERT_CONFIG = {
  severityLevels: [
    { id: 'critical', name: 'Critical', color: '#dc2626', priority: 1 },
    { id: 'high', name: 'High', color: '#ea580c', priority: 2 },
    { id: 'medium', name: 'Medium', color: '#eab308', priority: 3 },
    { id: 'low', name: 'Low', color: '#22c55e', priority: 4 }
  ],
  types: [
    { id: 'flood', name: 'Flood', icon: 'droplet' },
    { id: 'earthquake', name: 'Earthquake', icon: 'seismic' },
    { id: 'fire', name: 'Fire', icon: 'flame' },
    { id: 'health', name: 'Health Emergency', icon: 'medical' },
    { id: 'security', name: 'Security', icon: 'shield' },
    { id: 'weather', name: 'Severe Weather', icon: 'cloud' },
    { id: 'other', name: 'Other', icon: 'alert-circle' }
  ],
  status: [
    { id: 'active', name: 'Active', color: '#dc2626' },
    { id: 'resolved', name: 'Resolved', color: '#22c55e' },
    { id: 'pending', name: 'Pending', color: '#eab308' }
  ],
  autoExpiry: {
    critical: 24 * 60 * 60 * 1000, // 24 hours
    high: 12 * 60 * 60 * 1000,     // 12 hours
    medium: 6 * 60 * 60 * 1000,    // 6 hours
    low: 3 * 60 * 60 * 1000        // 3 hours
  }
};

// Resource Configurations
export const RESOURCE_CONFIG = {
  types: [
    { id: 'food', name: 'Food & Water', icon: 'utensils' },
    { id: 'medical', name: 'Medical Supplies', icon: 'medical' },
    { id: 'shelter', name: 'Shelter Materials', icon: 'home' },
    { id: 'transport', name: 'Transportation', icon: 'truck' },
    { id: 'communication', name: 'Communication', icon: 'radio' },
    { id: 'equipment', name: 'Equipment', icon: 'tools' },
    { id: 'personnel', name: 'Personnel', icon: 'users' },
    { id: 'other', name: 'Other', icon: 'package' }
  ],
  status: [
    { id: 'available', name: 'Available', color: '#22c55e' },
    { id: 'allocated', name: 'Allocated', color: '#3b82f6' },
    { id: 'critical', name: 'Critical Level', color: '#dc2626' },
    { id: 'maintenance', name: 'Under Maintenance', color: '#6b7280' }
  ],
  priorities: [
    { id: 'immediate', name: 'Immediate', color: '#dc2626' },
    { id: 'urgent', name: 'Urgent', color: '#ea580c' },
    { id: 'normal', name: 'Normal', color: '#22c55e' },
    { id: 'low', name: 'Low Priority', color: '#6b7280' }
  ]
};

// Geographic Data
export const GEOGRAPHIC_DATA = {
  country: {
    name: 'Pakistan',
    code: 'PK',
    center: [30.3753, 69.3451],
    bounds: [[23.0, 60.0], [37.0, 77.0]]
  },
  provinces: [
    {
      id: 'punjab',
      name: 'Punjab',
      capital: 'Lahore',
      population: 110012442,
      area: 205344,
      center: [31.1471, 72.7400],
      districts: 36
    },
    {
      id: 'sindh',
      name: 'Sindh',
      capital: 'Karachi',
      population: 47886051,
      area: 140914,
      center: [26.0, 68.0],
      districts: 29
    },
    {
      id: 'kpk',
      name: 'Khyber Pakhtunkhwa',
      capital: 'Peshawar',
      population: 30523371,
      area: 101741,
      center: [34.0, 72.0],
      districts: 25
    },
    {
      id: 'balochistan',
      name: 'Balochistan',
      capital: 'Quetta',
      population: 12344408,
      area: 347190,
      center: [28.0, 65.0],
      districts: 33
    },
    {
      id: 'islamabad',
      name: 'Islamabad Capital Territory',
      capital: 'Islamabad',
      population: 1014825,
      area: 906,
      center: [33.6844, 73.0479],
      districts: 1
    },
    {
      id: 'gilgit_baltistan',
      name: 'Gilgit-Baltistan',
      capital: 'Gilgit',
      population: 1800000,
      area: 72971,
      center: [35.0, 75.0],
      districts: 14
    },
    {
      id: 'ajk',
      name: 'Azad Jammu & Kashmir',
      capital: 'Muzaffarabad',
      population: 4045366,
      area: 13297,
      center: [34.0, 74.0],
      districts: 10
    }
  ]
};

// Dashboard Configurations
export const DASHBOARD_CONFIG = {
  refreshInterval: 30000, // 30 seconds
  maxRecentActivities: 20,
  maxNotifications: 50,
  defaultMapZoom: 6,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  charts: {
    defaultHeight: 300,
    colors: ['#0ea5e9', '#22c55e', '#eab308', '#dc2626', '#8b5cf6'],
    animationDuration: 750
  }
};

// Map Configurations
export const MAP_CONFIG = {
  defaultCenter: [30.3753, 69.3451],
  zoomLevels: {
    country: 6,
    province: 8,
    district: 10,
    city: 12,
    detailed: 15
  },
  layers: {
    base: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  },
  markers: {
    alert: { color: '#dc2626', size: 'large' },
    resource: { color: '#22c55e', size: 'medium' },
    shelter: { color: '#3b82f6', size: 'medium' },
    hospital: { color: '#ef4444', size: 'small' }
  }
};

// API Configurations
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  endpoints: {
    auth: '/auth',
    alerts: '/alerts',
    resources: '/resources',
    dashboard: '/dashboard',
    map: '/map',
    weather: '/weather'
  }
};

// Storage Keys
export const STORAGE_KEYS = {
  authToken: 'ndma_auth_token',
  userData: 'ndma_user_data',
  preferences: 'ndma_preferences',
  alerts: 'ndma_alerts',
  resources: 'ndma_resources',
  theme: 'ndma_theme',
  language: 'ndma_language',
  lastLogin: 'ndma_last_login'
};

// Theme Configurations
export const THEME_CONFIG = {
  primary: '#0ea5e9',
  secondary: '#64748b',
  success: '#22c55e',
  warning: '#eab308',
  error: '#dc2626',
  info: '#3b82f6',
  background: {
    primary: '#0f1629',
    secondary: '#1a1f2e',
    tertiary: '#252d3d'
  },
  text: {
    primary: '#ffffff',
    secondary: '#e2e8f0',
    muted: '#94a3b8'
  },
  border: {
    light: 'rgba(148, 163, 184, 0.08)',
    medium: 'rgba(148, 163, 184, 0.15)',
    dark: 'rgba(148, 163, 184, 0.05)'
  }
};

// Notification Configurations
export const NOTIFICATION_CONFIG = {
  position: 'top-right',
  duration: 5000,
  maxVisible: 5,
  types: {
    success: { icon: 'check-circle', color: '#22c55e' },
    error: { icon: 'x-circle', color: '#dc2626' },
    warning: { icon: 'alert-triangle', color: '#eab308' },
    info: { icon: 'info', color: '#3b82f6' }
  },
  sounds: {
    critical: '/sounds/critical-alert.mp3',
    high: '/sounds/high-alert.mp3',
    medium: '/sounds/medium-alert.mp3',
    success: '/sounds/success.mp3'
  }
};

// Form Validation Rules
export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    pattern: /^(\+92|0)?[0-9]{10}$/,
    message: 'Please enter a valid Pakistan phone number'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
  },
  coordinates: {
    latitude: { min: -90, max: 90 },
    longitude: { min: -180, max: 180 }
  }
};

// Date/Time Formats
export const DATE_FORMATS = {
  display: 'MMM d, yyyy',
  input: 'yyyy-MM-dd',
  time: 'HH:mm',
  datetime: 'MMM d, yyyy HH:mm',
  full: 'EEEE, MMMM d, yyyy HH:mm:ss',
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableWeatherIntegration: true,
  enableRealTimeUpdates: true,
  enableVoiceAlerts: false,
  enableMobileApp: false,
  enableAdvancedAnalytics: false,
  enableMultiLanguage: false
};

// UI Constants
export const UI_CONSTANTS = {
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  },
  COLORS: {
    PRIMARY: '#0ea5e9',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#3b82f6'
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px'
  },
  PROVINCE_DISTRICTS: {
    Punjab: ['Lahore', 'Rawalpindi', 'Multan', 'Faisalabad'],
    Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
    KPK: ['Peshawar', 'Abbottabad', 'Mardan', 'Swat'],
    Balochistan: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar'],
    Islamabad: ['Islamabad'],
    Gilgit: ['Gilgit'],
    AJK: ['Muzaffarabad'],
  }
};

export default {
  APP_CONFIG,
  USER_ROLES,
  ALERT_CONFIG,
  RESOURCE_CONFIG,
  GEOGRAPHIC_DATA,
  DASHBOARD_CONFIG,
  MAP_CONFIG,
  API_CONFIG,
  STORAGE_KEYS,
  THEME_CONFIG,
  NOTIFICATION_CONFIG,
  VALIDATION_RULES,
  DATE_FORMATS,
  FEATURE_FLAGS,
  UI_CONSTANTS
};