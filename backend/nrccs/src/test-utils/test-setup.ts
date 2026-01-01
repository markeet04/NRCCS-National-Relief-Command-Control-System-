/**
 * NRCCS - Test Setup Utilities
 *
 * This file contains shared test utilities, mocks, and helper functions
 * for backend controller testing. All tests must use these utilities
 * to ensure consistency and CI-safety.
 *
 * IMPORTANT: No real database connections, no external API calls.
 */

import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import {
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole, UserLevel } from '../common/entities/user.entity';

// ==================== MOCK USER FACTORY ====================

export interface MockUser {
  id: number;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  level: UserLevel | null;
  provinceId: number | null;
  districtId: number | null;
  phone: string | null;
  cnic: string | null;
  isActive: boolean;
}

export const createMockUser = (
  overrides: Partial<MockUser> = {},
): MockUser => ({
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  name: 'Test User',
  role: UserRole.CIVILIAN,
  level: null,
  provinceId: null,
  districtId: null,
  phone: '03001234567',
  cnic: '1234567890123',
  isActive: true,
  ...overrides,
});

export const mockSuperadmin = createMockUser({
  id: 1,
  email: 'superadmin@nrccs.gov.pk',
  name: 'Super Admin',
  role: UserRole.SUPERADMIN,
  level: UserLevel.NATIONAL,
});

export const mockNdmaUser = createMockUser({
  id: 2,
  email: 'ndma@nrccs.gov.pk',
  name: 'NDMA Officer',
  role: UserRole.NDMA,
  level: UserLevel.NATIONAL,
});

export const mockPdmaUser = createMockUser({
  id: 3,
  email: 'pdma@nrccs.gov.pk',
  name: 'PDMA Officer',
  role: UserRole.PDMA,
  level: UserLevel.PROVINCIAL,
  provinceId: 1,
});

export const mockDistrictUser = createMockUser({
  id: 4,
  email: 'district@nrccs.gov.pk',
  name: 'District Officer',
  role: UserRole.DISTRICT,
  level: UserLevel.DISTRICT,
  provinceId: 1,
  districtId: 1,
});

export const mockCivilianUser = createMockUser({
  id: 5,
  email: 'civilian@example.com',
  name: 'Civilian User',
  role: UserRole.CIVILIAN,
});

// ==================== MOCK GUARDS ====================

/**
 * Creates a mock SessionAuthGuard that either allows or denies access
 */
export const createMockSessionAuthGuard = (
  isAuthenticated: boolean,
  user?: MockUser,
) => ({
  canActivate: jest.fn((context: ExecutionContext) => {
    if (!isAuthenticated) {
      throw new UnauthorizedException('Not authenticated');
    }
    const request = context.switchToHttp().getRequest();
    request.user = user || mockCivilianUser;
    request.session = { user: user || mockCivilianUser };
    return true;
  }),
});

/**
 * Creates a mock RolesGuard that checks for specific roles
 */
export const createMockRolesGuard = (allowedRoles: UserRole[]) => ({
  canActivate: jest.fn((context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }),
});

// ==================== MOCK SERVICE FACTORY ====================

/**
 * Creates a mock service with all methods returning resolved promises
 */
export const createMockService = <T extends object>(
  methods: (keyof T)[],
): { [K in keyof T]: jest.Mock } => {
  const mock = {} as { [K in keyof T]: jest.Mock };
  methods.forEach((method) => {
    mock[method] = jest.fn().mockResolvedValue({});
  });
  return mock;
};

// ==================== MOCK RESPONSE DATA ====================

export const mockAlerts = [
  {
    id: 1,
    title: 'Flood Warning',
    description: 'Heavy rainfall expected',
    severity: 'high',
    status: 'active',
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 2,
    title: 'Heatwave Alert',
    description: 'Temperature exceeding 45°C',
    severity: 'medium',
    status: 'active',
    createdAt: new Date('2026-01-01'),
  },
];

export const mockShelters = [
  {
    id: 1,
    name: 'Central Relief Camp',
    address: '123 Main Street',
    capacity: 500,
    currentOccupancy: 250,
    status: 'active',
    districtId: 1,
    latitude: 33.6844,
    longitude: 73.0479,
  },
  {
    id: 2,
    name: 'Community Hall Shelter',
    address: '456 Park Road',
    capacity: 300,
    currentOccupancy: 150,
    status: 'active',
    districtId: 1,
    latitude: 33.7294,
    longitude: 73.0931,
  },
];

export const mockSosRequests = [
  {
    id: 'SOS-001',
    name: 'Ali Ahmed',
    phone: '03001234567',
    cnic: '1234567890123',
    locationLat: 33.6844,
    locationLng: 73.0479,
    location: 'Blue Area, Islamabad',
    emergencyType: 'flood',
    description: 'House flooded, family trapped',
    peopleCount: 5,
    status: 'pending',
    priority: 'high',
    createdAt: new Date('2026-01-01'),
  },
];

export const mockRescueTeams = [
  {
    id: 'RT-001',
    name: 'Alpha Team',
    leadName: 'Commander Khan',
    phone: '03001111111',
    memberCount: 10,
    status: 'available',
    specialization: 'flood_rescue',
    districtId: 1,
  },
];

export const mockProvinces = [
  { id: 1, name: 'Punjab', code: 'PB' },
  { id: 2, name: 'Sindh', code: 'SD' },
  { id: 3, name: 'KPK', code: 'KP' },
  { id: 4, name: 'Balochistan', code: 'BL' },
];

export const mockDistricts = [
  { id: 1, name: 'Lahore', provinceId: 1, population: 11000000 },
  { id: 2, name: 'Karachi', provinceId: 2, population: 15000000 },
];

export const mockResources = [
  {
    id: 1,
    type: 'food_supplies',
    name: 'Rice Bags',
    quantity: 1000,
    unit: 'kg',
    status: 'available',
  },
  {
    id: 2,
    type: 'medical_supplies',
    name: 'First Aid Kits',
    quantity: 500,
    unit: 'units',
    status: 'available',
  },
];

export const mockMissingPersons = [
  {
    id: 1,
    name: 'Fatima Bibi',
    age: 35,
    gender: 'female',
    lastSeenLocation: 'Market Road, Lahore',
    lastSeenDate: new Date('2025-12-28'),
    status: 'missing',
    description: 'Wearing blue dress, has brown hair',
    reporterName: 'Ahmad Khan',
    reporterPhone: '03002222222',
    districtId: 1,
  },
];

export const mockDashboardStats = {
  totalAlerts: 15,
  activeSosRequests: 42,
  totalShelters: 25,
  shelterOccupancy: 65,
  availableRescueTeams: 12,
  totalMissingPersons: 8,
  resourcesAvailable: 85,
};

export const mockDamageReports = [
  {
    id: 'DR-001',
    type: 'infrastructure',
    description: 'Bridge collapsed',
    severity: 'critical',
    status: 'pending',
    locationLat: 33.6844,
    locationLng: 73.0479,
    createdAt: new Date('2026-01-01'),
  },
];

export const mockAuditLogs = [
  {
    id: 1,
    userId: 1,
    action: 'CREATE_USER',
    entityType: 'user',
    entityId: '5',
    details: { email: 'newuser@example.com' },
    createdAt: new Date('2026-01-01'),
  },
];

export const mockActivityLogs = [
  {
    id: 1,
    userId: 1,
    action: 'login',
    description: 'User logged in',
    ipAddress: '192.168.1.1',
    createdAt: new Date('2026-01-01'),
  },
];

export const mockResourceSuggestions = [
  {
    id: 1,
    resourceType: 'food_supplies',
    suggestedQuantity: 500,
    reason: 'Based on flood prediction',
    provinceId: 1,
    status: 'pending',
    confidence: 0.85,
  },
];

export const mockFloodPrediction = {
  flood_risk: 'High',
  confidence: 0.87,
  factors: {
    precipitation: 'heavy',
    temperature: 'moderate',
    vegetation: 'low',
    snow_cover: 'minimal',
  },
};

// ==================== REQUEST/RESPONSE HELPERS ====================

export const createMockRequest = (overrides: any = {}) => ({
  user: mockCivilianUser,
  session: { user: mockCivilianUser },
  body: {},
  params: {},
  query: {},
  ...overrides,
});

export const createMockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
});

// ==================== DTO FACTORIES ====================

export const createValidSosDto = () => ({
  name: 'Ali Ahmed',
  phone: '03001234567',
  cnic: '1234567890123',
  locationLat: 33.6844,
  locationLng: 73.0479,
  location: 'Blue Area, Islamabad',
  emergencyType: 'flood',
  description: 'House flooded, need immediate help',
  peopleCount: 5,
  provinceId: 1,
  districtId: 1,
});

export const createValidMissingPersonDto = () => ({
  name: 'Fatima Bibi',
  age: 35,
  gender: 'female',
  lastSeenLocation: 'Market Road, Lahore',
  lastSeenDate: '2025-12-28',
  description: 'Wearing blue dress, has brown hair',
  reporterName: 'Ahmad Khan',
  reporterPhone: '03002222222',
  districtId: 1,
});

export const createValidUserDto = () => ({
  email: 'newuser@nrccs.gov.pk',
  password: 'SecurePass123!',
  name: 'New User',
  role: UserRole.DISTRICT,
  level: UserLevel.DISTRICT,
  provinceId: 1,
  districtId: 1,
  phone: '03003333333',
});

export const createValidAlertDto = () => ({
  title: 'Emergency Alert',
  description: 'Critical situation reported',
  severity: 'high',
  provinceId: 1,
  districtIds: [1, 2],
});

export const createValidShelterDto = () => ({
  name: 'New Shelter',
  address: '789 New Road',
  capacity: 200,
  latitude: 33.6844,
  longitude: 73.0479,
  districtId: 1,
  contactPhone: '03004444444',
});

export const createValidResourceDto = () => ({
  type: 'food_supplies',
  name: 'Rice Bags',
  quantity: 500,
  unit: 'kg',
  districtId: 1,
});

export const createValidFloodPredictionDto = () => ({
  precipitation: 150,
  temperature: 30,
  ndsi: 0.5,
  vegetation: 0.7,
  month: 8,
  provinceId: 1,
  generateAlert: false,
});

// ==================== ERROR HELPERS ====================

export class ServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export const createNotFoundError = (resource: string) =>
  new ServiceError(`${resource} not found`, 404);

export const createConflictError = (message: string) =>
  new ServiceError(message, 409);

export const createValidationError = (message: string) =>
  new ServiceError(message, 400);

// ==================== VALIDATION TEST HELPERS ====================

export const invalidPhoneNumbers = [
  '',
  '123',
  'abcdefghij',
  '0300123456', // too short
  '030012345678901', // too long
  '+1234567890', // non-Pakistani format
];

export const invalidCnics = [
  '',
  '123',
  '123456789012', // 12 digits
  '12345678901234', // 14 digits
  'abcdefghijklm', // letters
];

export const invalidEmails = [
  '',
  'invalid',
  'invalid@',
  '@invalid.com',
  'invalid.com',
];

export const invalidCoordinates = {
  lat: [-91, 91, NaN, 'invalid'],
  lng: [-181, 181, NaN, 'invalid'],
};
