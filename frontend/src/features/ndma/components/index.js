// NDMA Components - Centralized Exports

// NationalMap Component (ArcGIS integration - kept as-is)
export { default as NationalMap } from './NationalMap';

// Dashboard Components (ACTIVE)
export {
  DashboardStatsGrid,
  DashboardAlertBanner,
  NationalMapCard,
  DashboardResourceStatus,
  DashboardPageHeader,
} from './NDMADashboard';

// Dashboard Components (DEPRECATED - commented out Dec 27, 2025)
// export { StatsOverview, ResourceStatus, CriticalAlertBanner, WeatherMap } from './NDMADashboard';

// Alerts Page Components (ACTIVE)
export {
  AlertsPageHeader,
  AlertsStatsGrid,
  AlertCardItem,
  AlertsListContainer,
  AlertsLoadingState,
  AlertsErrorState,
  CreateAlertModal,
  AlertDetailsModal,
} from './AlertsPage';

// Resources Page Components (ACTIVE)
export {
  ResourceStats,
  AllocationModal,
  ResourcesPageHeader,
  ResourcesTabNavigation,
  NationalStockTab,
  ProvincialStockTab,
  AllocateResourcesTab,
  ProvincialRequestsTab,
  NationalStockCard,
  ProvinceResourceCardV2,
  ProvincialRequestCard,
  CircularResourceGauge,
  HistoryModal,
  ResourceHistoryModal,
  AddResourcesModal,
} from './ResourcesPage';

// Resources Page Components (DEPRECATED - commented out Dec 27, 2025)
// export { ResourceTable, ProvinceResourceCard, RequestDetailsModal } from './ResourcesPage';

// Flood Map Page Components (ACTIVE)
export {
  NdmaFloodMap,
  ManageMapsModal,
  FloodMapSection,
  MLPredictionPanel,
  ProvinceStatusPanel,
} from './FloodMapPage';

// Flood Map Page Components (DEPRECATED - commented out Dec 27, 2025)
// export { ProvinceStatusCard, CriticalAreasPanel, ShelterCapacityCard } from './FloodMapPage';
