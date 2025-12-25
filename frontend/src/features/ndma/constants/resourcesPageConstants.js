/**
 * Resources Page Constants
 * Static data and configuration for the NDMA Resources Management page
 */

// Resource categories configuration
export const RESOURCE_CATEGORIES = [
  { id: 'food', label: 'Food Supplies', unit: 'tons', icon: 'utensils' },
  { id: 'medical', label: 'Medical Kits', unit: 'kits', icon: 'first-aid' },
  { id: 'shelter', label: 'Shelter Materials', unit: 'units', icon: 'home' },
  { id: 'water', label: 'Clean Water', unit: 'liters', icon: 'droplet' },
];

// Initial national stock data
export const INITIAL_NATIONAL_STOCK = {
  food: { available: 15000, allocated: 6500, unit: 'tons' },
  medical: { available: 25000, allocated: 9500, unit: 'kits' },
  shelter: { available: 8000, allocated: 4000, unit: 'units' },
  water: { available: 500000, allocated: 250000, unit: 'liters' },
};

// Provincial allocation data
export const INITIAL_PROVINCIAL_ALLOCATIONS = [
  { 
    province: 'Punjab', 
    food: 2500, 
    medical: 3500, 
    shelter: 1800, 
    water: 100000,
    status: 'adequate',
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  { 
    province: 'Sindh', 
    food: 2200, 
    medical: 3000, 
    shelter: 1500, 
    water: 85000,
    status: 'adequate',
    lastUpdated: '2024-01-15T09:45:00Z',
  },
  { 
    province: 'KPK', 
    food: 1800, 
    medical: 2500, 
    shelter: 1200, 
    water: 65000,
    status: 'moderate',
    lastUpdated: '2024-01-15T11:00:00Z',
  },
  { 
    province: 'Balochistan', 
    food: 1200, 
    medical: 1800, 
    shelter: 600, 
    water: 45000,
    status: 'low',
    lastUpdated: '2024-01-15T08:30:00Z',
  },
  { 
    province: 'Gilgit-Baltistan', 
    food: 500, 
    medical: 800, 
    shelter: 250, 
    water: 15000,
    status: 'adequate',
    lastUpdated: '2024-01-15T07:15:00Z',
  },
  { 
    province: 'Azad Kashmir', 
    food: 300, 
    medical: 400, 
    shelter: 150, 
    water: 10000,
    status: 'adequate',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
];

// Resource status levels
export const RESOURCE_STATUS_LEVELS = {
  adequate: { label: 'Adequate', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
  moderate: { label: 'Moderate', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.15)' },
  low: { label: 'Low', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.15)' },
  critical: { label: 'Critical', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
};

// Tab configuration for resources page
export const RESOURCE_TABS = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
  { id: 'national', label: 'National Stock', icon: 'warehouse' },
  { id: 'provincial', label: 'Provincial Allocation', icon: 'map-pin' },
  { id: 'requests', label: 'Pending Requests', icon: 'inbox' },
];

// Statistics cards configuration
export const RESOURCE_STATS_CONFIG = [
  {
    key: 'totalResources',
    label: 'Total Resources',
    icon: 'package',
    color: '#3b82f6',
    calculateValue: (stock) => Object.values(stock).reduce((acc, item) => acc + item.available, 0),
  },
  {
    key: 'allocated',
    label: 'Allocated',
    icon: 'truck',
    color: '#22c55e',
    calculateValue: (stock) => Object.values(stock).reduce((acc, item) => acc + item.allocated, 0),
  },
  {
    key: 'available',
    label: 'Available',
    icon: 'box',
    color: '#eab308',
    calculateValue: (stock) => Object.values(stock).reduce((acc, item) => acc + (item.available - item.allocated), 0),
  },
  {
    key: 'provinces',
    label: 'Provinces Covered',
    icon: 'map',
    color: '#8b5cf6',
    calculateValue: (_, allocations) => allocations.length,
  },
];

// Allocation modal configuration
export const ALLOCATION_MODAL_CONFIG = {
  title: 'Allocate Resources',
  subtitle: 'Allocate resources to a province',
  submitText: 'Confirm Allocation',
  cancelText: 'Cancel',
};

// Table columns configuration
export const ALLOCATION_TABLE_COLUMNS = [
  { key: 'province', label: 'Province', sortable: true },
  { key: 'food', label: 'Food (tons)', sortable: true },
  { key: 'medical', label: 'Medical Kits', sortable: true },
  { key: 'shelter', label: 'Shelter Units', sortable: true },
  { key: 'water', label: 'Water (L)', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
];

export default {
  RESOURCE_CATEGORIES,
  INITIAL_NATIONAL_STOCK,
  INITIAL_PROVINCIAL_ALLOCATIONS,
  RESOURCE_STATUS_LEVELS,
  RESOURCE_TABS,
  RESOURCE_STATS_CONFIG,
  ALLOCATION_MODAL_CONFIG,
  ALLOCATION_TABLE_COLUMNS,
};
