/**
 * NDMA Constants Index
 * Centralized exports for all NDMA-related constants
 */

// Dashboard constants
export {
  DASHBOARD_STATS,
  RESOURCE_STATUS,
  WEATHER_MAP_CONFIG,
  ALERT_THRESHOLDS,
  QUICK_ACTIONS,
  PROVINCE_SUMMARY,
} from './ndmaDashboardConstants';

// Alerts page constants
export {
  SEVERITY_LEVELS,
  ALERT_STATUS,
  ALERT_TYPES,
  INITIAL_ALERT_FORM,
  ALERT_STATS_CONFIG,
  MODAL_CONFIG,
  ALERT_VALIDATION_RULES,
} from './alertsPageConstants';

// Resources page constants
export {
  RESOURCE_CATEGORIES,
  INITIAL_NATIONAL_STOCK,
  INITIAL_PROVINCIAL_ALLOCATIONS,
  RESOURCE_STATUS_LEVELS,
  RESOURCE_TABS,
  RESOURCE_STATS_CONFIG,
  ALLOCATION_MODAL_CONFIG,
  ALLOCATION_TABLE_COLUMNS,
} from './resourcesPageConstants';

// Flood map page constants
export {
  PROVINCE_STATUS_DATA,
  CRITICAL_AREAS,
  SHELTER_CAPACITY,
  FLOOD_RISK_LEVELS,
  STATUS_COLORS,
  MAP_LAYERS,
  MAP_TYPE_OPTIONS,
  FLOOD_STATS_CONFIG,
} from './floodMapPageConstants';

// Default exports for convenience
export { default as dashboardConstants } from './ndmaDashboardConstants';
export { default as alertsConstants } from './alertsPageConstants';
export { default as resourcesConstants } from './resourcesPageConstants';
export { default as floodMapConstants } from './floodMapPageConstants';
