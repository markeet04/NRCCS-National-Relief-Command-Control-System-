// Provincial Map Constants

export const FLOOD_ZONES = [
  { id: 1, name: 'Karachi Coastal', risk: 'critical', lat: 24.8607, lon: 67.0011, affectedPopulation: 2500, shelters: 8 },
  { id: 2, name: 'Sukkur Valley', risk: 'high', lat: 27.7162, lon: 68.8711, affectedPopulation: 1800, shelters: 5 },
  { id: 3, name: 'Hyderabad Suburbs', risk: 'medium', lat: 25.3548, lon: 68.3336, affectedPopulation: 950, shelters: 3 },
  { id: 4, name: 'Larkana Region', risk: 'stable', lat: 27.5614, lon: 68.2114, affectedPopulation: 0, shelters: 1 },
  { id: 5, name: 'Mirpur Khas', risk: 'medium', lat: 25.5222, lon: 69.0115, affectedPopulation: 650, shelters: 2 }
];

export const FLOOD_ZONE_COLORS = {
  critical: { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
  high: { bg: '#f97316', light: 'rgba(249, 115, 22, 0.1)' },
  medium: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
  stable: { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' }
};

export const MAP_CENTER = [29.9124, 68.7738];
export const DEFAULT_MAP_ZOOM = 6;
