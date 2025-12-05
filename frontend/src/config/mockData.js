/**
 * Mock Data for Deliverable 3
 * Provides realistic test data for all features
 * Will be replaced with real API calls in Deliverable 4
 */

// Mock Users
export const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@nrccs.gov.pk',
    name: 'System Administrator',
    role: 'superadmin',
    password: 'admin123',
  },
  {
    id: 2,
    email: 'ndma@nrccs.gov.pk',
    name: 'NDMA Officer',
    role: 'ndma',
    password: 'ndma123',
  },
  {
    id: 3,
    email: 'pdma.punjab@nrccs.gov.pk',
    name: 'PDMA Punjab Officer',
    role: 'pdma',
    province: 'Punjab',
    password: 'pdma123',
  },
  {
    id: 4,
    email: 'district.lahore@nrccs.gov.pk',
    name: 'District Officer Lahore',
    role: 'district',
    province: 'Punjab',
    district: 'Lahore',
    password: 'district123',
  },
  {
    id: 5,
    email: 'citizen@example.com',
    name: 'Ali Ahmed',
    role: 'civilian',
    phone: '+92-300-1234567',
    password: 'citizen123',
  },
];

// Mock Provinces
export const MOCK_PROVINCES = [
  { id: 1, name: 'Punjab', code: 'PB', districts: 36 },
  { id: 2, name: 'Sindh', code: 'SD', districts: 29 },
  { id: 3, name: 'Khyber Pakhtunkhwa', code: 'KP', districts: 35 },
  { id: 4, name: 'Balochistan', code: 'BL', districts: 34 },
];

// Mock Districts
export const MOCK_DISTRICTS = [
  { id: 1, name: 'Lahore', province: 'Punjab', population: 11126285 },
  { id: 2, name: 'Faisalabad', province: 'Punjab', population: 7873910 },
  { id: 3, name: 'Rawalpindi', province: 'Punjab', population: 5405633 },
  { id: 4, name: 'Multan', province: 'Punjab', population: 4745109 },
  { id: 5, name: 'Karachi Central', province: 'Sindh', population: 2970000 },
  { id: 6, name: 'Karachi East', province: 'Sindh', population: 2910000 },
  { id: 7, name: 'Hyderabad', province: 'Sindh', population: 1732693 },
  { id: 8, name: 'Peshawar', province: 'Khyber Pakhtunkhwa', population: 4269079 },
  { id: 9, name: 'Quetta', province: 'Balochistan', population: 2275699 },
];

// Mock SOS Requests
export const MOCK_SOS_REQUESTS = [
  {
    id: 1,
    citizenName: 'Ali Ahmed',
    phone: '+92-300-1234567',
    location: { lat: 31.5204, lng: 74.3587, address: 'Model Town, Lahore' },
    status: 'pending',
    priority: 'high',
    description: 'Stranded on rooftop, water level rising',
    timestamp: new Date('2024-12-05T08:30:00'),
    district: 'Lahore',
  },
  {
    id: 2,
    citizenName: 'Fatima Khan',
    phone: '+92-301-7654321',
    location: { lat: 31.4504, lng: 74.2711, address: 'Johar Town, Lahore' },
    status: 'assigned',
    priority: 'medium',
    description: 'Medical emergency - elderly parent needs evacuation',
    timestamp: new Date('2024-12-05T09:15:00'),
    district: 'Lahore',
    assignedTeam: 'Team Alpha',
  },
  {
    id: 3,
    citizenName: 'Hassan Raza',
    phone: '+92-302-9876543',
    location: { lat: 31.5656, lng: 74.3242, address: 'Gulberg, Lahore' },
    status: 'completed',
    priority: 'high',
    description: 'Family trapped in flooded area',
    timestamp: new Date('2024-12-05T07:00:00'),
    completedAt: new Date('2024-12-05T09:45:00'),
    district: 'Lahore',
    assignedTeam: 'Team Bravo',
  },
];

// Mock Shelters
export const MOCK_SHELTERS = [
  {
    id: 1,
    name: 'Government Girls School Shelter',
    address: 'Township, Lahore',
    district: 'Lahore',
    province: 'Punjab',
    location: { lat: 31.4647, lng: 74.2697 },
    capacity: 500,
    currentOccupancy: 327,
    facilities: ['Food', 'Water', 'Medical Aid', 'Electricity'],
    contactPerson: 'Dr. Sarah Ali',
    contactPhone: '+92-300-1111111',
    status: 'active',
  },
  {
    id: 2,
    name: 'Community Center Shelter',
    address: 'Model Town, Lahore',
    district: 'Lahore',
    province: 'Punjab',
    location: { lat: 31.4838, lng: 74.3193 },
    capacity: 300,
    currentOccupancy: 198,
    facilities: ['Food', 'Water', 'Medical Aid'],
    contactPerson: 'Ahmed Hassan',
    contactPhone: '+92-300-2222222',
    status: 'active',
  },
  {
    id: 3,
    name: 'Sports Complex Shelter',
    address: 'Gulberg, Lahore',
    district: 'Lahore',
    province: 'Punjab',
    location: { lat: 31.5204, lng: 74.3587 },
    capacity: 1000,
    currentOccupancy: 856,
    facilities: ['Food', 'Water', 'Medical Aid', 'Electricity', 'Sanitation'],
    contactPerson: 'Bilal Khan',
    contactPhone: '+92-300-3333333',
    status: 'active',
  },
];

// Mock Alerts
export const MOCK_ALERTS = [
  {
    id: 1,
    title: 'Severe Flood Warning - Punjab',
    type: 'flood_warning',
    severity: 'critical',
    description: 'Heavy rainfall expected in next 24 hours. Evacuate low-lying areas.',
    affectedAreas: ['Lahore', 'Faisalabad', 'Gujranwala'],
    province: 'Punjab',
    issuedBy: 'NDMA',
    issuedAt: new Date('2024-12-05T06:00:00'),
    expiresAt: new Date('2024-12-06T18:00:00'),
    status: 'active',
  },
  {
    id: 2,
    title: 'Evacuation Notice - Johar Town',
    type: 'evacuation',
    severity: 'high',
    description: 'Mandatory evacuation for residents of Johar Town due to rising water levels.',
    affectedAreas: ['Lahore'],
    province: 'Punjab',
    issuedBy: 'PDMA Punjab',
    issuedAt: new Date('2024-12-05T07:30:00'),
    expiresAt: new Date('2024-12-05T20:00:00'),
    status: 'active',
  },
  {
    id: 3,
    title: 'Weather Update - All Clear',
    type: 'all_clear',
    severity: 'low',
    description: 'Weather conditions improving. Residents can return home safely.',
    affectedAreas: ['Multan'],
    province: 'Punjab',
    issuedBy: 'PDMA Punjab',
    issuedAt: new Date('2024-12-04T18:00:00'),
    status: 'expired',
  },
];

// Mock Resources
export const MOCK_RESOURCES = [
  { id: 1, name: 'Food Packages', quantity: 5000, unit: 'packages', status: 'available', location: 'NDMA Warehouse' },
  { id: 2, name: 'Water Bottles', quantity: 10000, unit: 'bottles', status: 'available', location: 'NDMA Warehouse' },
  { id: 3, name: 'Medical Kits', quantity: 500, unit: 'kits', status: 'available', location: 'NDMA Warehouse' },
  { id: 4, name: 'Tents', quantity: 1000, unit: 'units', status: 'available', location: 'NDMA Warehouse' },
  { id: 5, name: 'Blankets', quantity: 3000, unit: 'units', status: 'available', location: 'NDMA Warehouse' },
  { id: 6, name: 'Rescue Boats', quantity: 50, unit: 'boats', status: 'deployed', location: 'Lahore District' },
];

// Mock Rescue Teams
export const MOCK_RESCUE_TEAMS = [
  {
    id: 1,
    name: 'Team Alpha',
    members: 8,
    status: 'on-mission',
    location: { lat: 31.4504, lng: 74.2711 },
    equipment: ['Boat', 'Medical Kit', 'Communication Radio'],
    contactPhone: '+92-300-4444444',
    district: 'Lahore',
  },
  {
    id: 2,
    name: 'Team Bravo',
    members: 6,
    status: 'available',
    location: { lat: 31.5204, lng: 74.3587 },
    equipment: ['Boat', 'Life Jackets', 'First Aid'],
    contactPhone: '+92-300-5555555',
    district: 'Lahore',
  },
  {
    id: 3,
    name: 'Team Charlie',
    members: 10,
    status: 'resting',
    location: { lat: 31.4647, lng: 74.2697 },
    equipment: ['2 Boats', 'Medical Equipment', 'Communication Gear'],
    contactPhone: '+92-300-6666666',
    district: 'Lahore',
  },
];

// Mock Missing Persons
export const MOCK_MISSING_PERSONS = [
  {
    id: 1,
    name: 'Muhammad Akram',
    age: 45,
    gender: 'Male',
    description: 'Last seen wearing blue shalwar kameez',
    lastSeenLocation: 'Johar Town, Lahore',
    lastSeenDate: new Date('2024-12-04T16:00:00'),
    reportedBy: 'Ayesha Akram',
    reporterContact: '+92-301-1234567',
    photo: null,
    status: 'searching',
  },
  {
    id: 2,
    name: 'Zainab Fatima',
    age: 12,
    gender: 'Female',
    description: 'Wearing pink dress, carrying school bag',
    lastSeenLocation: 'Model Town, Lahore',
    lastSeenDate: new Date('2024-12-05T08:00:00'),
    reportedBy: 'Khalid Mahmood',
    reporterContact: '+92-302-7654321',
    photo: null,
    status: 'searching',
  },
];

// Mock Statistics
export const MOCK_NATIONAL_STATS = {
  totalAffectedPeople: 125000,
  totalShelters: 145,
  totalSOSRequests: 892,
  totalRescueTeams: 78,
  alertsIssued: 23,
  resourcesAllocated: 15000,
};

export const MOCK_PROVINCIAL_STATS = {
  Punjab: {
    affectedPeople: 45000,
    shelters: 52,
    sosRequests: 342,
    rescueTeams: 28,
  },
  Sindh: {
    affectedPeople: 38000,
    shelters: 41,
    sosRequests: 289,
    rescueTeams: 22,
  },
  'Khyber Pakhtunkhwa': {
    affectedPeople: 27000,
    shelters: 35,
    sosRequests: 178,
    rescueTeams: 18,
  },
  Balochistan: {
    affectedPeople: 15000,
    shelters: 17,
    sosRequests: 83,
    rescueTeams: 10,
  },
};

export default {
  MOCK_USERS,
  MOCK_PROVINCES,
  MOCK_DISTRICTS,
  MOCK_SOS_REQUESTS,
  MOCK_SHELTERS,
  MOCK_ALERTS,
  MOCK_RESOURCES,
  MOCK_RESCUE_TEAMS,
  MOCK_MISSING_PERSONS,
  MOCK_NATIONAL_STATS,
  MOCK_PROVINCIAL_STATS,
};
