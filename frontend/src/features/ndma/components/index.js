// NDMA Components - Centralized Exports

// NationalMap Component (ArcGIS integration - kept as-is)
export { default as NationalMap } from './NationalMap';

// Dashboard Components
export {
  StatsOverview,
  ResourceStatus,
  CriticalAlertBanner,
  WeatherMap,
} from './NDMADashboard';

// Alerts Page Components
export {
  AlertStatistics,
  AlertList,
  CreateAlertModal,
  AlertDetailsModal,
} from './AlertsPage';

// Resources Page Components
export {
  ResourceStats,
  ResourceTable,
  AllocationModal,
} from './ResourcesPage';

// Flood Map Page Components
export {
  ProvinceStatusCard,
  CriticalAreasPanel,
  ShelterCapacityCard,
} from './FloodMapPage';
