// Mock shelter data
export const MOCK_SHELTERS = [
  {
    id: 1,
    name: 'Central Community Shelter',
    address: 'Block 5, Gulshan-e-Iqbal, Karachi',
    latitude: 24.9141,
    longitude: 67.0960,
    distance: 2.3,
    capacity: { total: 500, current: 347, available: 153 },
    facilities: ['Medical', 'Food', 'Water', 'Electricity', 'Security'],
    contact: '+92-300-1234567',
    status: 'available',
    rating: 4.5,
    lastUpdated: '5 mins ago',
  },
  {
    id: 2,
    name: 'Northern Relief Camp',
    address: 'University Road, Karachi',
    latitude: 24.9456,
    longitude: 67.1100,
    distance: 4.8,
    capacity: { total: 300, current: 280, available: 20 },
    facilities: ['Medical', 'Food', 'Water', 'Blankets'],
    contact: '+92-300-2345678',
    status: 'limited',
    rating: 4.2,
    lastUpdated: '8 mins ago',
  },
  {
    id: 3,
    name: 'City District Shelter',
    address: 'Saddar Town, Karachi',
    latitude: 24.8607,
    longitude: 67.0011,
    distance: 5.2,
    capacity: { total: 400, current: 398, available: 2 },
    facilities: ['Medical', 'Food', 'Water', 'Electricity', 'Security', 'Blankets'],
    contact: '+92-300-3456789',
    status: 'full',
    rating: 4.7,
    lastUpdated: '3 mins ago',
  },
  {
    id: 4,
    name: 'Green Valley Emergency Center',
    address: 'Defence Phase 8, Karachi',
    latitude: 24.8138,
    longitude: 67.0294,
    distance: 6.5,
    capacity: { total: 250, current: 120, available: 130 },
    facilities: ['Medical', 'Food', 'Water', 'Electricity', 'Internet', 'Security'],
    contact: '+92-300-4567890',
    status: 'available',
    rating: 4.8,
    lastUpdated: '2 mins ago',
  },
  {
    id: 5,
    name: 'East District Relief Point',
    address: 'Malir Cantonment, Karachi',
    latitude: 24.9436,
    longitude: 67.2097,
    distance: 8.1,
    capacity: { total: 350, current: 210, available: 140 },
    facilities: ['Medical', 'Food', 'Water', 'Blankets', 'Security'],
    contact: '+92-300-5678901',
    status: 'available',
    rating: 4.3,
    lastUpdated: '10 mins ago',
  },
  {
    id: 6,
    name: 'Clifton Safe Haven',
    address: 'Clifton Block 2, Karachi',
    latitude: 24.8141,
    longitude: 67.0278,
    distance: 9.3,
    capacity: { total: 180, current: 95, available: 85 },
    facilities: ['Medical', 'Food', 'Water', 'Electricity', 'Internet'],
    contact: '+92-300-6789012',
    status: 'available',
    rating: 4.6,
    lastUpdated: '7 mins ago',
  },
  {
    id: 7,
    name: 'Korangi Emergency Hub',
    address: 'Korangi Industrial Area, Karachi',
    latitude: 24.8406,
    longitude: 67.1208,
    distance: 12.4,
    capacity: { total: 450, current: 445, available: 5 },
    facilities: ['Medical', 'Food', 'Water', 'Security'],
    contact: '+92-300-7890123',
    status: 'limited',
    rating: 4.0,
    lastUpdated: '15 mins ago',
  },
  {
    id: 8,
    name: 'North Nazimabad Relief Center',
    address: 'Block B, North Nazimabad, Karachi',
    latitude: 24.9300,
    longitude: 67.0389,
    distance: 3.7,
    capacity: { total: 320, current: 180, available: 140 },
    facilities: ['Medical', 'Food', 'Water', 'Electricity', 'Blankets', 'Security'],
    contact: '+92-300-8901234',
    status: 'available',
    rating: 4.4,
    lastUpdated: '4 mins ago',
  },
];

// Facility icons mapping
export const FACILITY_ICONS = {
  Medical: '🏥',
  Food: '🍽️',
  Water: '💧',
  Electricity: '⚡',
  Internet: '📶',
  Security: '🛡️',
  Blankets: '🛏️',
};

// Status color configuration
export const STATUS_CONFIG = {
  available: {
    color: '#10b981',
    label: 'Available',
  },
  limited: {
    color: '#f59e0b',
    label: 'Limited Space',
  },
  full: {
    color: '#ef4444',
    label: 'Full',
  },
};

// Default fallback location (Karachi center)
export const DEFAULT_LOCATION = {
  latitude: 24.8607,
  longitude: 67.0011,
};

// Initial filter state
export const INITIAL_SHELTER_FILTERS = {
  maxDistance: 50,
  minCapacity: 0,
  status: 'all',
  facilities: [],
};

// Leaflet icon URLs
export const LEAFLET_ICON_URLS = {
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
};
