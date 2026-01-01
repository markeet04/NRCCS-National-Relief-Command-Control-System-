/**
 * Frontend Test Utilities
 * NRCCS - National Relief Command & Control System
 * 
 * Provides:
 * - Custom render function with providers
 * - Mock data factories
 * - Mock context values
 * - Common test helpers
 */

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// ============================================
// Mock User Data
// ============================================

export const mockUsers = {
  superadmin: {
    id: 1,
    email: 'superadmin@nrccs.gov.pk',
    name: 'Super Admin',
    role: 'SUPERADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  ndma: {
    id: 2,
    email: 'ndma@nrccs.gov.pk',
    name: 'NDMA Official',
    role: 'NDMA',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  pdma: {
    id: 3,
    email: 'pdma.punjab@nrccs.gov.pk',
    name: 'PDMA Punjab Official',
    role: 'PDMA',
    provinceId: 1,
    provinceName: 'Punjab',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  district: {
    id: 4,
    email: 'district.lahore@nrccs.gov.pk',
    name: 'District Lahore Coordinator',
    role: 'DISTRICT',
    districtId: 1,
    districtName: 'Lahore',
    provinceId: 1,
    provinceName: 'Punjab',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  civilian: {
    id: 5,
    email: 'citizen@example.com',
    name: 'Test Citizen',
    role: 'CIVILIAN',
    phone: '+923001234567',
    cnic: '3520112345678',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
};

// ============================================
// Mock Alert Data
// ============================================

export const mockAlerts = [
  {
    id: 1,
    title: 'Flash Flood Warning',
    description: 'Heavy rainfall expected in northern areas',
    type: 'FLOOD',
    severity: 'HIGH',
    status: 'ACTIVE',
    provinceId: 1,
    provinceName: 'Punjab',
    districtId: 1,
    districtName: 'Lahore',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 2,
    title: 'Earthquake Advisory',
    description: 'Minor tremors reported in Islamabad region',
    type: 'EARTHQUAKE',
    severity: 'MEDIUM',
    status: 'ACTIVE',
    provinceId: 2,
    provinceName: 'Sindh',
    districtId: 5,
    districtName: 'Karachi',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 43200000).toISOString(),
  },
  {
    id: 3,
    title: 'Heat Wave Warning',
    description: 'Temperature expected to exceed 45°C',
    type: 'HEAT_WAVE',
    severity: 'LOW',
    status: 'RESOLVED',
    provinceId: 2,
    provinceName: 'Sindh',
    districtId: 5,
    districtName: 'Karachi',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    resolvedAt: new Date().toISOString(),
  },
];

// ============================================
// Mock SOS Data
// ============================================

export const mockSosRequests = [
  {
    id: 1,
    citizenId: 5,
    citizenName: 'Test Citizen',
    citizenPhone: '+923001234567',
    emergencyType: 'FLOOD',
    description: 'Trapped on rooftop due to rising water',
    status: 'PENDING',
    priority: 'HIGH',
    latitude: 31.5204,
    longitude: 74.3587,
    address: '123 Main St, Lahore',
    districtId: 1,
    districtName: 'Lahore',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    citizenId: 6,
    citizenName: 'Another Citizen',
    citizenPhone: '+923009876543',
    emergencyType: 'MEDICAL',
    description: 'Need medical assistance urgently',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    latitude: 31.5500,
    longitude: 74.3400,
    address: '456 Side St, Lahore',
    districtId: 1,
    districtName: 'Lahore',
    createdAt: new Date().toISOString(),
    assignedTeamId: 1,
  },
];

// ============================================
// Mock Shelter Data
// ============================================

export const mockShelters = [
  {
    id: 1,
    name: 'Lahore Relief Camp A',
    address: 'Sports Complex, Lahore',
    latitude: 31.5204,
    longitude: 74.3587,
    capacity: 500,
    currentOccupancy: 250,
    status: 'ACTIVE',
    facilities: ['Food', 'Water', 'Medical', 'Beds'],
    districtId: 1,
    districtName: 'Lahore',
    contactPhone: '+924235000000',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Karachi Emergency Shelter',
    address: 'Exhibition Ground, Karachi',
    latitude: 24.8607,
    longitude: 67.0011,
    capacity: 1000,
    currentOccupancy: 800,
    status: 'ACTIVE',
    facilities: ['Food', 'Water', 'Medical'],
    districtId: 5,
    districtName: 'Karachi',
    contactPhone: '+922199000000',
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// Mock Rescue Team Data
// ============================================

export const mockRescueTeams = [
  {
    id: 1,
    name: 'Alpha Rescue Unit',
    status: 'AVAILABLE',
    memberCount: 8,
    specialization: 'Flood Rescue',
    vehicleType: 'Rescue Boat',
    districtId: 1,
    districtName: 'Lahore',
    contactNumber: '+923001111111',
    latitude: 31.5200,
    longitude: 74.3500,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Bravo Medical Team',
    status: 'ON_MISSION',
    memberCount: 6,
    specialization: 'Medical Emergency',
    vehicleType: 'Ambulance',
    districtId: 1,
    districtName: 'Lahore',
    contactNumber: '+923002222222',
    currentMissionId: 2,
    latitude: 31.5500,
    longitude: 74.3400,
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// Mock Resource Data
// ============================================

export const mockResources = [
  {
    id: 1,
    name: 'Drinking Water',
    type: 'WATER',
    quantity: 5000,
    unit: 'liters',
    status: 'AVAILABLE',
    districtId: 1,
    districtName: 'Lahore',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Emergency Rations',
    type: 'FOOD',
    quantity: 1000,
    unit: 'packets',
    status: 'AVAILABLE',
    districtId: 1,
    districtName: 'Lahore',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'First Aid Kits',
    type: 'MEDICAL',
    quantity: 200,
    unit: 'kits',
    status: 'LOW_STOCK',
    districtId: 1,
    districtName: 'Lahore',
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// Mock Province/District Data
// ============================================

export const mockProvinces = [
  { id: 1, name: 'Punjab', code: 'PB', totalDistricts: 36 },
  { id: 2, name: 'Sindh', code: 'SD', totalDistricts: 30 },
  { id: 3, name: 'KPK', code: 'KP', totalDistricts: 35 },
  { id: 4, name: 'Balochistan', code: 'BL', totalDistricts: 34 },
  { id: 5, name: 'Gilgit-Baltistan', code: 'GB', totalDistricts: 10 },
  { id: 6, name: 'AJK', code: 'AJ', totalDistricts: 10 },
];

export const mockDistricts = [
  { id: 1, name: 'Lahore', provinceId: 1, provinceName: 'Punjab', population: 11126285 },
  { id: 2, name: 'Rawalpindi', provinceId: 1, provinceName: 'Punjab', population: 5405633 },
  { id: 3, name: 'Faisalabad', provinceId: 1, provinceName: 'Punjab', population: 7873910 },
  { id: 4, name: 'Multan', provinceId: 1, provinceName: 'Punjab', population: 4745109 },
  { id: 5, name: 'Karachi', provinceId: 2, provinceName: 'Sindh', population: 14910352 },
  { id: 6, name: 'Hyderabad', provinceId: 2, provinceName: 'Sindh', population: 3429471 },
];

// ============================================
// Mock Dashboard Stats
// ============================================

export const mockDashboardStats = {
  activeAlerts: 5,
  totalSosRequests: 23,
  pendingSos: 8,
  activeShelters: 15,
  totalCapacity: 5000,
  currentOccupancy: 2500,
  availableTeams: 12,
  onMissionTeams: 5,
  resourcesAvailable: 85,
  criticalResources: 3,
};

// ============================================
// Mock Auth Context Value
// ============================================

export const createMockAuthContext = (user = null, isAuthenticated = false) => ({
  user,
  isAuthenticated,
  isLoading: false,
  login: vi.fn().mockResolvedValue({ success: true }),
  logout: vi.fn().mockResolvedValue({ success: true }),
  checkAuth: vi.fn().mockResolvedValue(isAuthenticated),
});

// ============================================
// Mock Toast Context Value
// ============================================

export const createMockToastContext = () => ({
  toasts: [],
  addToast: vi.fn(),
  removeToast: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
});

// ============================================
// Custom Render with Providers
// ============================================

const AllProviders = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

export const renderWithProviders = (ui, options = {}) => {
  return render(ui, { wrapper: AllProviders, ...options });
};

// ============================================
// Async Helpers
// ============================================

export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const flushPromises = () =>
  new Promise((resolve) => setImmediate(resolve));

// ============================================
// Form Helpers
// ============================================

export const fillForm = async (user, fields) => {
  for (const [label, value] of Object.entries(fields)) {
    const input = document.querySelector(`[name="${label}"]`) ||
                  document.querySelector(`[aria-label="${label}"]`);
    if (input) {
      await user.clear(input);
      await user.type(input, value);
    }
  }
};

// ============================================
// API Response Factories
// ============================================

export const createApiResponse = (data, status = 200) => ({
  data,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  headers: {},
  config: {},
});

export const createApiError = (message, status = 400) => {
  const error = new Error(message);
  error.response = {
    data: { message },
    status,
    statusText: status === 400 ? 'Bad Request' : 'Error',
  };
  return error;
};

// ============================================
// Mock API Service
// ============================================

export const createMockApiService = () => ({
  get: vi.fn().mockResolvedValue(createApiResponse({})),
  post: vi.fn().mockResolvedValue(createApiResponse({})),
  put: vi.fn().mockResolvedValue(createApiResponse({})),
  patch: vi.fn().mockResolvedValue(createApiResponse({})),
  delete: vi.fn().mockResolvedValue(createApiResponse({})),
});

// Re-export everything from testing-library
export * from '@testing-library/react';
