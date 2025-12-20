/**
 * Alerts Page Constants
 * Static data and configuration for the NDMA Alerts Management page
 */

// Alert severity levels configuration
export const SEVERITY_LEVELS = [
  { value: 'critical', label: 'Critical', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
  { value: 'high', label: 'High', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.15)' },
  { value: 'medium', label: 'Medium', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.15)' },
  { value: 'low', label: 'Low', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)' },
];

// Alert status options
export const ALERT_STATUS = {
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  PENDING: 'pending',
  ESCALATED: 'escalated',
};

// Alert types configuration
export const ALERT_TYPES = [
  { value: 'flood', label: 'Flood', icon: 'droplets' },
  { value: 'earthquake', label: 'Earthquake', icon: 'activity' },
  { value: 'storm', label: 'Storm', icon: 'cloud-lightning' },
  { value: 'drought', label: 'Drought', icon: 'sun' },
  { value: 'landslide', label: 'Landslide', icon: 'mountain' },
  { value: 'fire', label: 'Fire', icon: 'flame' },
  { value: 'epidemic', label: 'Epidemic', icon: 'shield-alert' },
  { value: 'other', label: 'Other', icon: 'alert-circle' },
];

// Initial form state for creating new alerts
export const INITIAL_ALERT_FORM = {
  title: '',
  description: '',
  severity: 'high',
  type: 'flood',
  province: '',
  district: '',
  tehsil: '',
  source: 'NDMA',
};

// Statistics card configuration for alerts page
export const ALERT_STATS_CONFIG = [
  {
    key: 'critical',
    label: 'Critical',
    filterFn: (alerts) => alerts.filter(a => a.severity === 'critical' && a.status === 'active'),
    gradient: {
      light: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      dark: 'linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
    },
    border: {
      light: '1px solid #fecaca',
      dark: '1px solid rgba(239, 68, 68, 0.2)',
    },
    textColor: '#ef4444',
    valueColor: '#dc2626',
  },
  {
    key: 'high',
    label: 'High',
    filterFn: (alerts) => alerts.filter(a => a.severity === 'high' && a.status === 'active'),
    gradient: {
      light: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
      dark: 'linear-gradient(to right, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.1))',
    },
    border: {
      light: '1px solid #fed7aa',
      dark: '1px solid rgba(249, 115, 22, 0.2)',
    },
    textColor: '#f97316',
    valueColor: '#ea580c',
  },
  {
    key: 'medium',
    label: 'Medium',
    filterFn: (alerts) => alerts.filter(a => a.severity === 'medium' && a.status === 'active'),
    gradient: {
      light: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
      dark: 'linear-gradient(to right, rgba(234, 179, 8, 0.1), rgba(202, 138, 4, 0.1))',
    },
    border: {
      light: '1px solid #fde047',
      dark: '1px solid rgba(234, 179, 8, 0.2)',
    },
    textColor: '#eab308',
    valueColor: '#ca8a04',
  },
  {
    key: 'resolved',
    label: 'Resolved Today',
    filterFn: (alerts, isToday) => alerts.filter(a => a.status === 'resolved' && isToday(a.resolvedAt || a.timestamp)),
    gradient: {
      light: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      dark: 'linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))',
    },
    border: {
      light: '1px solid #bbf7d0',
      dark: '1px solid rgba(34, 197, 94, 0.2)',
    },
    textColor: '#22c55e',
    valueColor: '#16a34a',
  },
];

// Modal configuration
export const MODAL_CONFIG = {
  createAlert: {
    title: 'Create New Alert',
    submitText: 'Publish Alert',
    loadingText: 'Publishing...',
  },
  viewAlert: {
    title: 'Alert Details',
    subtitle: 'Full alert information',
  },
};

// Validation rules for alert form
export const ALERT_VALIDATION_RULES = {
  title: {
    required: true,
    minLength: 5,
    maxLength: 100,
    message: 'Title must be between 5 and 100 characters',
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: 'Description must be between 10 and 500 characters',
  },
  severity: {
    required: true,
    validValues: ['critical', 'high', 'medium', 'low'],
    message: 'Please select a valid severity level',
  },
  province: {
    required: false,
    message: 'Please select at least one province',
  },
};

export default {
  SEVERITY_LEVELS,
  ALERT_STATUS,
  ALERT_TYPES,
  INITIAL_ALERT_FORM,
  ALERT_STATS_CONFIG,
  MODAL_CONFIG,
  ALERT_VALIDATION_RULES,
};
