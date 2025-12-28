/**
 * District Components Index
 * Central export for all district-specific components
 */

// Dashboard Components (from DistrictDashboard folder)
// StatCard removed - now using shared component from @shared/components/dashboard
export { WeatherCard, AlertsList, LiveMapCard, SOSTable } from './DistrictDashboard';

// Map Component
export { default as DistrictMap } from './DistrictMap';

// Shared Components
export { default as KPICard } from './shared/KPICard';
export { default as StatusPieChart } from './shared/StatusPieChart';
export { default as SearchFilterBar } from './shared/SearchFilterBar';
export { default as StatusBadge } from './shared/StatusBadge';
export { default as Modal } from './shared/Modal';
export { default as ActionButton } from './shared/ActionButton';
export { default as FormField } from './shared/FormField';
export { default as EntityCard } from './shared/EntityCard';
export { default as ProgressBar } from './shared/ProgressBar';

