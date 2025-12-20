// ⚠️ DEPRECATED: All hardcoded DATA constants have been replaced with backend API calls
// UI-only constants (colors, icons, filter options) are still exported below
// Data constants are commented out and should not be used

// Export UI styling constants (STILL VALID)
export { SEVERITY_BORDER_COLORS, STATUS_COLORS } from './pdmaDashboardConstants';
export { RESOURCE_STATUS_COLORS, RESOURCE_DISTRIBUTION_FILTERS } from './resourceDistributionConstants';
export { DISTRICT_STATUS_COLORS } from './districtCoordinationConstants';
export { CAPACITY_STATUS_COLORS } from './shelterManagementConstants';
export * from './provincialMapConstants'; // Map configuration

// DEPRECATED - DO NOT USE (data now comes from backend)
// export { PDMA_DASHBOARD_STATS, PDMA_DASHBOARD_ALERTS, PDMA_DASHBOARD_RESOURCES } from './pdmaDashboardConstants';
// export { RESOURCE_DISTRIBUTION_DATA } from './resourceDistributionConstants';
// export { DISTRICT_COORDINATION_DISTRICTS } from './districtCoordinationConstants';
// export { SHELTER_MANAGEMENT_DATA } from './shelterManagementConstants';
