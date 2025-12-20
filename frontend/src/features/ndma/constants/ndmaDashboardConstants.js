/**
 * NDMA Dashboard Constants
 * Static data and configuration for the NDMA Dashboard page
 */

// Dashboard statistics configuration
export const DASHBOARD_STATS = [
  { 
    label: 'Active Disasters', 
    value: 3, 
    change: '+1', 
    trend: 'up',
    color: 'red',
    icon: 'alert-triangle'
  },
  { 
    label: 'Provinces Affected', 
    value: 4, 
    change: '0', 
    trend: 'stable',
    color: 'orange',
    icon: 'map'
  },
  { 
    label: 'People Displaced', 
    value: '45.2K', 
    change: '+2.1K', 
    trend: 'up',
    color: 'yellow',
    icon: 'users'
  },
  { 
    label: 'Relief Camps', 
    value: 127, 
    change: '+12', 
    trend: 'up',
    color: 'green',
    icon: 'home'
  },
];

// Resource status data for dashboard
export const RESOURCE_STATUS = [
  { 
    type: 'Food Supplies', 
    allocated: 85, 
    status: 'adequate',
    unit: 'tons',
    lastUpdated: '2 hours ago'
  },
  { 
    type: 'Medical Kits', 
    allocated: 92, 
    status: 'adequate',
    unit: 'kits',
    lastUpdated: '1 hour ago'
  },
  { 
    type: 'Shelter Materials', 
    allocated: 67, 
    status: 'low',
    unit: 'units',
    lastUpdated: '3 hours ago'
  },
  { 
    type: 'Clean Water', 
    allocated: 78, 
    status: 'moderate',
    unit: 'liters',
    lastUpdated: '30 mins ago'
  },
];

// Weather map configuration
export const WEATHER_MAP_CONFIG = {
  defaultCenter: [30.3753, 69.3451], // Pakistan center
  defaultZoom: 5,
  refreshInterval: 300000, // 5 minutes
  layers: ['temperature', 'precipitation', 'wind'],
};

// Critical alert thresholds
export const ALERT_THRESHOLDS = {
  critical: { min: 0, max: 25, color: '#ef4444' },
  high: { min: 26, max: 50, color: '#f97316' },
  medium: { min: 51, max: 75, color: '#eab308' },
  low: { min: 76, max: 100, color: '#22c55e' },
};

// Dashboard quick actions
export const QUICK_ACTIONS = [
  { id: 'create-alert', label: 'Create Alert', icon: 'plus', route: '/ndma/alerts' },
  { id: 'allocate-resources', label: 'Allocate Resources', icon: 'package', route: '/ndma/resources' },
  { id: 'view-map', label: 'View Flood Map', icon: 'map', route: '/ndma/flood-map' },
  { id: 'generate-report', label: 'Generate Report', icon: 'file-text', route: '/ndma/reports' },
];

// Province summary for dashboard widget
export const PROVINCE_SUMMARY = {
  Punjab: { alerts: 5, camps: 42, displaced: 15000 },
  Sindh: { alerts: 8, camps: 35, displaced: 18000 },
  KPK: { alerts: 3, camps: 28, displaced: 8000 },
  Balochistan: { alerts: 2, camps: 15, displaced: 3500 },
  'Gilgit-Baltistan': { alerts: 1, camps: 5, displaced: 700 },
  'Azad Kashmir': { alerts: 0, camps: 2, displaced: 0 },
};

export default {
  DASHBOARD_STATS,
  RESOURCE_STATUS,
  WEATHER_MAP_CONFIG,
  ALERT_THRESHOLDS,
  QUICK_ACTIONS,
  PROVINCE_SUMMARY,
};
