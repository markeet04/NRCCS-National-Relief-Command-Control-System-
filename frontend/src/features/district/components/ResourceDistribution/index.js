/**
 * ResourceDistribution Components
 * Modular components for the Resource Distribution page
 */

// UI Components
export { default as ResourceFilters } from './ResourceFilters';
export { default as ResourceStats } from './ResourceStats';
export { default as ResourceGrid } from './ResourceGrid';
export { default as ResourceCard } from './ResourceCard';
export { default as DistrictStockCard } from './DistrictStockCard';
export { default as ResourceHistoryModal } from './ResourceHistoryModal';
export { default as AllocateToSheltersTab } from './AllocateToSheltersTab';
export { default as ShelterResourcesTab } from './ShelterResourcesTab';

// Form Components
export { default as AllocateByTypeForm } from './AllocateByTypeForm';
export { default as AllocateToShelterForm } from './AllocateToShelterForm';

// Re-export validated modal from ResourceRequest
export { default as RequestResourceModal } from '../ResourceRequest/RequestResourceModal';
