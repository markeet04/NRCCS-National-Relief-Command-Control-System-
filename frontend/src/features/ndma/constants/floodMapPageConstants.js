/**
 * Flood Map Page Constants
 * Static data and configuration for the NDMA Flood Map page
 */

// Province status data for flood monitoring
// Initially set to LOW risk - ML prediction will update
export const PROVINCE_STATUS_DATA = [
  {
    id: 'punjab',
    name: 'Punjab',
    status: 'normal',
    waterLevel: 15,
    floodRisk: 'low',
    affectedDistricts: 0,
    evacuated: 0,
    coordinates: [31.1704, 72.7097],
  },
  {
    id: 'sindh',
    name: 'Sindh',
    status: 'normal',
    waterLevel: 15,
    floodRisk: 'low',
    affectedDistricts: 0,
    evacuated: 0,
    coordinates: [25.8943, 68.5247],
  },
  {
    id: 'kpk',
    name: 'Khyber Pakhtunkhwa',
    status: 'normal',
    waterLevel: 15,
    floodRisk: 'low',
    affectedDistricts: 0,
    evacuated: 0,
    coordinates: [34.9526, 72.3311],
  },
  {
    id: 'balochistan',
    name: 'Balochistan',
    status: 'normal',
    waterLevel: 15,
    floodRisk: 'low',
    affectedDistricts: 0,
    evacuated: 0,
    coordinates: [28.4907, 65.0958],
  },
  {
    id: 'gb',
    name: 'Gilgit-Baltistan',
    status: 'normal',
    waterLevel: 15,
    floodRisk: 'low',
    affectedDistricts: 0,
    evacuated: 0,
    coordinates: [35.8026, 74.9832],
  },
  {
    id: 'ajk',
    name: 'Azad Kashmir',
    status: 'normal',
    waterLevel: 15,
    floodRisk: 'low',
    affectedDistricts: 0,
    evacuated: 0,
    coordinates: [33.9259, 73.7810],
  },
];

// Critical areas data
export const CRITICAL_AREAS = [
  {
    id: 1,
    name: 'Sukkur Barrage',
    type: 'dam',
    status: 'critical',
    waterLevel: 95,
    threshold: 90,
    location: 'Sindh',
    coordinates: [27.7052, 68.8574],
    lastUpdated: '10 mins ago',
  },
  {
    id: 2,
    name: 'Taunsa Barrage',
    type: 'dam',
    status: 'warning',
    waterLevel: 82,
    threshold: 85,
    location: 'Punjab',
    coordinates: [30.5312, 70.8496],
    lastUpdated: '15 mins ago',
  },
  {
    id: 3,
    name: 'Guddu Barrage',
    type: 'dam',
    status: 'warning',
    waterLevel: 78,
    threshold: 80,
    location: 'Sindh',
    coordinates: [28.4242, 69.7252],
    lastUpdated: '5 mins ago',
  },
  {
    id: 4,
    name: 'Chashma Barrage',
    type: 'dam',
    status: 'normal',
    waterLevel: 65,
    threshold: 85,
    location: 'Punjab',
    coordinates: [32.4358, 71.3804],
    lastUpdated: '20 mins ago',
  },
  {
    id: 5,
    name: 'Kotri Barrage',
    type: 'dam',
    status: 'critical',
    waterLevel: 93,
    threshold: 88,
    location: 'Sindh',
    coordinates: [25.3667, 68.3167],
    lastUpdated: '8 mins ago',
  },
];

// Shelter capacity data
export const SHELTER_CAPACITY = [
  { province: 'Punjab', total: 50, occupied: 42, capacity: 25000 },
  { province: 'Sindh', total: 65, occupied: 58, capacity: 32000 },
  { province: 'KPK', total: 35, occupied: 28, capacity: 15000 },
  { province: 'Balochistan', total: 20, occupied: 12, capacity: 8000 },
  { province: 'Gilgit-Baltistan', total: 10, occupied: 5, capacity: 3000 },
  { province: 'Azad Kashmir', total: 8, occupied: 3, capacity: 2500 },
];

// Flood risk levels configuration
export const FLOOD_RISK_LEVELS = {
  critical: { label: 'Critical', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)', threshold: 90 },
  high: { label: 'High', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.15)', threshold: 75 },
  medium: { label: 'Medium', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.15)', threshold: 50 },
  low: { label: 'Low', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)', threshold: 0 },
};

// Status colors for province cards
export const STATUS_COLORS = {
  critical: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
  warning: { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', text: '#f97316' },
  normal: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
};

// Map layer options
export const MAP_LAYERS = [
  { id: 'flood-zones', label: 'Flood Zones', icon: 'layers', enabled: true },
  { id: 'water-level', label: 'Water Level', icon: 'droplets', enabled: true },
  { id: 'evacuation-routes', label: 'Evacuation Routes', icon: 'route', enabled: false },
  { id: 'relief-camps', label: 'Relief Camps', icon: 'tent', enabled: true },
  { id: 'hospitals', label: 'Hospitals', icon: 'hospital', enabled: false },
  { id: 'weather-overlay', label: 'Weather Overlay', icon: 'cloud', enabled: true },
];

// Map type options for the modal
export const MAP_TYPE_OPTIONS = [
  { id: 'satellite', label: 'Satellite View', description: 'High-resolution satellite imagery' },
  { id: 'terrain', label: 'Terrain Map', description: 'Topographic elevation data' },
  { id: 'hybrid', label: 'Hybrid View', description: 'Satellite with road overlays' },
  { id: 'flood-risk', label: 'Flood Risk Zones', description: 'Color-coded flood risk areas' },
];

// Summary statistics configuration
export const FLOOD_STATS_CONFIG = [
  {
    key: 'totalAffected',
    label: 'Total Affected Districts',
    icon: 'map-pin',
    color: '#ef4444',
    calculateValue: (provinces) => provinces.reduce((acc, p) => acc + p.affectedDistricts, 0),
  },
  {
    key: 'evacuated',
    label: 'People Evacuated',
    icon: 'users',
    color: '#3b82f6',
    calculateValue: (provinces) => provinces.reduce((acc, p) => acc + p.evacuated, 0),
  },
  {
    key: 'criticalAreas',
    label: 'Critical Areas',
    icon: 'alert-triangle',
    color: '#f97316',
    calculateValue: (_, critical) => critical.filter(a => a.status === 'critical').length,
  },
  {
    key: 'shelterOccupancy',
    label: 'Shelter Occupancy',
    icon: 'home',
    color: '#22c55e',
    calculateValue: (_, __, shelters) => {
      const totalOccupied = shelters.reduce((acc, s) => acc + s.occupied, 0);
      const totalCapacity = shelters.reduce((acc, s) => acc + s.total, 0);
      return `${Math.round((totalOccupied / totalCapacity) * 100)}%`;
    },
  },
];

export default {
  PROVINCE_STATUS_DATA,
  CRITICAL_AREAS,
  SHELTER_CAPACITY,
  FLOOD_RISK_LEVELS,
  STATUS_COLORS,
  MAP_LAYERS,
  MAP_TYPE_OPTIONS,
  FLOOD_STATS_CONFIG,
};
