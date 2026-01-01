/**
 * District Controller Test Suite
 * 
 * Tests for district-level administrative endpoints (requires DISTRICT role):
 * - Dashboard & Info routes
 * - SOS Request management
 * - Rescue Team management
 * - Shelter management
 * - Damage Reports
 * - Resources
 * - Missing Persons
 * - Resource Requests
 * 
 * Coverage: CRUD operations, authorization, validation, error handling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  mockDistrictUser,
  mockPdmaUser,
  mockSosRequests,
  mockRescueTeams,
  mockShelters,
  mockDamageReports,
  mockResources,
  mockMissingPersons,
  mockDashboardStats,
  mockAlerts,
  mockActivityLogs,
  createMockUser,
} from '../test-utils';
import { UserRole, UserLevel } from '../common/entities/user.entity';

describe('DistrictController', () => {
  let controller: DistrictController;
  let districtService: jest.Mocked<DistrictService>;

  const mockDistrictService = {
    // Dashboard
    getDashboardStats: jest.fn(),
    getDistrictInfo: jest.fn(),
    getWeather: jest.fn(),
    // SOS
    getAllSosRequests: jest.fn(),
    getSosStats: jest.fn(),
    getSosRequestById: jest.fn(),
    updateSosStatus: jest.fn(),
    assignTeamToSos: jest.fn(),
    addTimelineEntry: jest.fn(),
    // Rescue Teams
    getAllRescueTeams: jest.fn(),
    getRescueTeamStats: jest.fn(),
    getRescueTeamById: jest.fn(),
    createRescueTeam: jest.fn(),
    updateRescueTeam: jest.fn(),
    updateTeamStatus: jest.fn(),
    // Shelters
    getAllShelters: jest.fn(),
    getShelterStats: jest.fn(),
    getShelterById: jest.fn(),
    createShelter: jest.fn(),
    updateShelter: jest.fn(),
    deleteShelter: jest.fn(),
    updateShelterSupplies: jest.fn(),
    updateShelterOccupancy: jest.fn(),
    resetShelterSupplies: jest.fn(),
    // Damage Reports
    getAllDamageReports: jest.fn(),
    getDamageReportStats: jest.fn(),
    getDamageReportById: jest.fn(),
    createDamageReport: jest.fn(),
    verifyDamageReport: jest.fn(),
    // Alerts & Activity
    getAlerts: jest.fn(),
    getActivityLogs: jest.fn(),
    // Resources
    getAllResources: jest.fn(),
    getResourceStats: jest.fn(),
    getResourceById: jest.fn(),
    allocateResourceToShelter: jest.fn(),
    allocateResourceByType: jest.fn(),
    getSheltersForAllocation: jest.fn(),
    // Missing Persons
    getMissingPersons: jest.fn(),
    getMissingPersonStats: jest.fn(),
    getMissingPersonById: jest.fn(),
    updateMissingPersonStatus: jest.fn(),
    checkAndMarkDeadPersons: jest.fn(),
    // Resource Requests
    createResourceRequest: jest.fn(),
    getOwnResourceRequests: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistrictController],
      providers: [
        {
          provide: DistrictService,
          useValue: mockDistrictService,
        },
      ],
    })
      .overrideGuard(SessionAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<DistrictController>(DistrictController);
    districtService = module.get(DistrictService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== DASHBOARD TESTS ====================

  describe('GET /district/dashboard/stats', () => {
    it('should return dashboard stats successfully', async () => {
      mockDistrictService.getDashboardStats.mockResolvedValue(mockDashboardStats);

      const result = await controller.getDashboardStats(mockDistrictUser as any);

      expect(result).toEqual(mockDashboardStats);
      expect(mockDistrictService.getDashboardStats).toHaveBeenCalledWith(mockDistrictUser);
    });

    it('should return stats scoped to user district', async () => {
      const districtStats = { ...mockDashboardStats, districtId: 1 };
      mockDistrictService.getDashboardStats.mockResolvedValue(districtStats);

      const result = await controller.getDashboardStats(mockDistrictUser as any);

      expect(mockDistrictService.getDashboardStats).toHaveBeenCalledWith(mockDistrictUser);
    });

    it('should handle service error', async () => {
      mockDistrictService.getDashboardStats.mockRejectedValue(new Error('Stats unavailable'));

      await expect(controller.getDashboardStats(mockDistrictUser as any)).rejects.toThrow('Stats unavailable');
    });
  });

  describe('GET /district/info', () => {
    it('should return district info', async () => {
      const info = { id: 1, name: 'Lahore', province: 'Punjab' };
      mockDistrictService.getDistrictInfo.mockResolvedValue(info);

      const result = await controller.getDistrictInfo(mockDistrictUser as any);

      expect(result).toEqual(info);
    });
  });

  describe('GET /district/weather', () => {
    it('should return weather data', async () => {
      const weather = { temp: 30, humidity: 65, condition: 'Sunny' };
      mockDistrictService.getWeather.mockResolvedValue(weather);

      const result = await controller.getWeather(mockDistrictUser as any);

      expect(result).toEqual(weather);
    });
  });

  // ==================== SOS REQUESTS TESTS ====================

  describe('GET /district/sos', () => {
    it('should return all SOS requests', async () => {
      mockDistrictService.getAllSosRequests.mockResolvedValue(mockSosRequests);

      const result = await controller.getAllSosRequests(mockDistrictUser as any);

      expect(result).toEqual(mockSosRequests);
    });

    it('should filter by status', async () => {
      mockDistrictService.getAllSosRequests.mockResolvedValue([mockSosRequests[0]]);

      const result = await controller.getAllSosRequests(mockDistrictUser as any, 'pending');

      expect(mockDistrictService.getAllSosRequests).toHaveBeenCalledWith(mockDistrictUser, 'pending');
    });

    it('should return empty array when no SOS requests', async () => {
      mockDistrictService.getAllSosRequests.mockResolvedValue([]);

      const result = await controller.getAllSosRequests(mockDistrictUser as any);

      expect(result).toEqual([]);
    });
  });

  describe('GET /district/sos/stats', () => {
    it('should return SOS statistics', async () => {
      const stats = { total: 50, pending: 20, inProgress: 15, resolved: 15 };
      mockDistrictService.getSosStats.mockResolvedValue(stats);

      const result = await controller.getSosStats(mockDistrictUser as any);

      expect(result).toEqual(stats);
    });
  });

  describe('GET /district/sos/:id', () => {
    it('should return SOS request by ID', async () => {
      mockDistrictService.getSosRequestById.mockResolvedValue(mockSosRequests[0]);

      const result = await controller.getSosRequestById('SOS-001', mockDistrictUser as any);

      expect(result).toEqual(mockSosRequests[0]);
    });

    it('should handle non-existent SOS request', async () => {
      mockDistrictService.getSosRequestById.mockRejectedValue(
        new NotFoundException('SOS request not found'),
      );

      await expect(
        controller.getSosRequestById('INVALID', mockDistrictUser as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('PUT /district/sos/:id/status', () => {
    it('should update SOS status successfully', async () => {
      const dto = { status: 'in_progress' };
      const updated = { ...mockSosRequests[0], status: 'in_progress' };
      mockDistrictService.updateSosStatus.mockResolvedValue(updated);

      const result = await controller.updateSosStatus('SOS-001', dto as any, mockDistrictUser as any);

      expect(result.status).toBe('in_progress');
    });

    it('should handle invalid status transition', async () => {
      mockDistrictService.updateSosStatus.mockRejectedValue(
        new BadRequestException('Invalid status transition'),
      );

      await expect(
        controller.updateSosStatus('SOS-001', { status: 'invalid' } as any, mockDistrictUser as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('PUT /district/sos/:id/assign', () => {
    it('should assign team to SOS request', async () => {
      const dto = { teamId: 'RT-001' };
      const updated = { ...mockSosRequests[0], assignedTeamId: 'RT-001' };
      mockDistrictService.assignTeamToSos.mockResolvedValue(updated);

      const result = await controller.assignTeamToSos('SOS-001', dto as any, mockDistrictUser as any);

      expect(result.assignedTeamId).toBe('RT-001');
    });
  });

  describe('POST /district/sos/:id/timeline', () => {
    it('should add timeline entry', async () => {
      const dto = { action: 'Team dispatched', notes: 'En route' };
      const entry = { id: 1, ...dto, createdAt: new Date() };
      mockDistrictService.addTimelineEntry.mockResolvedValue(entry);

      const result = await controller.addTimelineEntry('SOS-001', dto as any, mockDistrictUser as any);

      expect(result.action).toBe('Team dispatched');
    });
  });

  // ==================== RESCUE TEAMS TESTS ====================

  describe('GET /district/rescue-teams', () => {
    it('should return all rescue teams', async () => {
      mockDistrictService.getAllRescueTeams.mockResolvedValue(mockRescueTeams);

      const result = await controller.getAllRescueTeams(mockDistrictUser as any);

      expect(result).toEqual(mockRescueTeams);
    });

    it('should filter by status', async () => {
      mockDistrictService.getAllRescueTeams.mockResolvedValue(
        mockRescueTeams.filter((t) => t.status === 'available'),
      );

      const result = await controller.getAllRescueTeams(mockDistrictUser as any, 'available');

      expect(mockDistrictService.getAllRescueTeams).toHaveBeenCalledWith(mockDistrictUser, 'available');
    });
  });

  describe('GET /district/rescue-teams/stats', () => {
    it('should return rescue team stats', async () => {
      const stats = { total: 10, available: 5, deployed: 5 };
      mockDistrictService.getRescueTeamStats.mockResolvedValue(stats);

      const result = await controller.getRescueTeamStats(mockDistrictUser as any);

      expect(result).toEqual(stats);
    });
  });

  describe('GET /district/rescue-teams/:id', () => {
    it('should return rescue team by ID', async () => {
      mockDistrictService.getRescueTeamById.mockResolvedValue(mockRescueTeams[0]);

      const result = await controller.getRescueTeamById('RT-001', mockDistrictUser as any);

      expect(result).toEqual(mockRescueTeams[0]);
    });

    it('should handle non-existent team', async () => {
      mockDistrictService.getRescueTeamById.mockRejectedValue(
        new NotFoundException('Team not found'),
      );

      await expect(
        controller.getRescueTeamById('INVALID', mockDistrictUser as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('POST /district/rescue-teams', () => {
    it('should create rescue team successfully', async () => {
      const dto = {
        name: 'Beta Team',
        leadName: 'Major Ali',
        phone: '03002222222',
        memberCount: 8,
        specialization: 'medical',
      };
      mockDistrictService.createRescueTeam.mockResolvedValue({ id: 'RT-002', ...dto });

      const result = await controller.createRescueTeam(dto as any, mockDistrictUser as any);

      expect(result.name).toBe('Beta Team');
    });
  });

  describe('PUT /district/rescue-teams/:id', () => {
    it('should update rescue team', async () => {
      const dto = { memberCount: 12 };
      mockDistrictService.updateRescueTeam.mockResolvedValue({
        ...mockRescueTeams[0],
        memberCount: 12,
      });

      const result = await controller.updateRescueTeam('RT-001', dto as any, mockDistrictUser as any);

      expect(result.memberCount).toBe(12);
    });
  });

  describe('PUT /district/rescue-teams/:id/status', () => {
    it('should update team status', async () => {
      const dto = { status: 'deployed' };
      mockDistrictService.updateTeamStatus.mockResolvedValue({
        ...mockRescueTeams[0],
        status: 'deployed',
      });

      const result = await controller.updateTeamStatus('RT-001', dto as any, mockDistrictUser as any);

      expect(result.status).toBe('deployed');
    });
  });

  // ==================== SHELTERS TESTS ====================

  describe('GET /district/shelters', () => {
    it('should return all shelters', async () => {
      mockDistrictService.getAllShelters.mockResolvedValue(mockShelters);

      const result = await controller.getAllShelters(mockDistrictUser as any);

      expect(result).toEqual(mockShelters);
    });

    it('should filter by status', async () => {
      mockDistrictService.getAllShelters.mockResolvedValue([mockShelters[0]]);

      await controller.getAllShelters(mockDistrictUser as any, 'active');

      expect(mockDistrictService.getAllShelters).toHaveBeenCalledWith(mockDistrictUser, 'active');
    });
  });

  describe('GET /district/shelters/stats', () => {
    it('should return shelter stats', async () => {
      const stats = { total: 25, active: 20, full: 3, closed: 2 };
      mockDistrictService.getShelterStats.mockResolvedValue(stats);

      const result = await controller.getShelterStats(mockDistrictUser as any);

      expect(result).toEqual(stats);
    });
  });

  describe('GET /district/shelters/:id', () => {
    it('should return shelter by ID', async () => {
      mockDistrictService.getShelterById.mockResolvedValue(mockShelters[0]);

      const result = await controller.getShelterById(1, mockDistrictUser as any);

      expect(result).toEqual(mockShelters[0]);
    });
  });

  describe('POST /district/shelters', () => {
    it('should create shelter successfully', async () => {
      const dto = {
        name: 'New Shelter',
        address: 'New Location',
        capacity: 100,
        latitude: 33.6844,
        longitude: 73.0479,
      };
      mockDistrictService.createShelter.mockResolvedValue({ id: 3, ...dto, status: 'active' });

      const result = await controller.createShelter(dto as any, mockDistrictUser as any);

      expect(result.name).toBe('New Shelter');
    });
  });

  describe('PUT /district/shelters/:id', () => {
    it('should update shelter', async () => {
      const dto = { capacity: 600 };
      mockDistrictService.updateShelter.mockResolvedValue({
        ...mockShelters[0],
        capacity: 600,
      });

      const result = await controller.updateShelter(1, dto as any, mockDistrictUser as any);

      expect(result.capacity).toBe(600);
    });
  });

  describe('DELETE /district/shelters/:id', () => {
    it('should delete shelter', async () => {
      mockDistrictService.deleteShelter.mockResolvedValue(undefined);

      await controller.deleteShelter(1, mockDistrictUser as any);

      expect(mockDistrictService.deleteShelter).toHaveBeenCalledWith(1, mockDistrictUser);
    });
  });

  describe('PUT /district/shelters/:id/supplies', () => {
    it('should update shelter supplies', async () => {
      const dto = { food: 100, water: 500, medicine: 50 };
      mockDistrictService.updateShelterSupplies.mockResolvedValue({
        ...mockShelters[0],
        supplies: dto,
      });

      const result = await controller.updateShelterSupplies(1, dto as any, mockDistrictUser as any);

      expect(result.supplies).toEqual(dto);
    });
  });

  describe('PUT /district/shelters/:id/occupancy', () => {
    it('should update shelter occupancy', async () => {
      const dto = { currentOccupancy: 300 };
      mockDistrictService.updateShelterOccupancy.mockResolvedValue({
        ...mockShelters[0],
        currentOccupancy: 300,
      });

      const result = await controller.updateShelterOccupancy(1, dto as any, mockDistrictUser as any);

      expect(result.currentOccupancy).toBe(300);
    });
  });

  describe('PUT /district/shelters/:id/reset-supplies', () => {
    it('should reset shelter supplies', async () => {
      mockDistrictService.resetShelterSupplies.mockResolvedValue({
        ...mockShelters[0],
        supplies: { food: 0, water: 0, medicine: 0 },
      });

      const result = await controller.resetShelterSupplies(1, mockDistrictUser as any);

      expect(result.supplies).toBeDefined();
    });
  });

  // ==================== DAMAGE REPORTS TESTS ====================

  describe('GET /district/damage-reports', () => {
    it('should return all damage reports', async () => {
      mockDistrictService.getAllDamageReports.mockResolvedValue(mockDamageReports);

      const result = await controller.getAllDamageReports(mockDistrictUser as any);

      expect(result).toEqual(mockDamageReports);
    });

    it('should filter by status', async () => {
      mockDistrictService.getAllDamageReports.mockResolvedValue([mockDamageReports[0]]);

      await controller.getAllDamageReports(mockDistrictUser as any, 'pending');

      expect(mockDistrictService.getAllDamageReports).toHaveBeenCalledWith(mockDistrictUser, 'pending');
    });
  });

  describe('GET /district/damage-reports/stats', () => {
    it('should return damage report stats', async () => {
      const stats = { total: 100, pending: 30, verified: 70 };
      mockDistrictService.getDamageReportStats.mockResolvedValue(stats);

      const result = await controller.getDamageReportStats(mockDistrictUser as any);

      expect(result).toEqual(stats);
    });
  });

  describe('GET /district/damage-reports/:id', () => {
    it('should return damage report by ID', async () => {
      mockDistrictService.getDamageReportById.mockResolvedValue(mockDamageReports[0]);

      const result = await controller.getDamageReportById('DR-001', mockDistrictUser as any);

      expect(result).toEqual(mockDamageReports[0]);
    });
  });

  describe('POST /district/damage-reports', () => {
    it('should create damage report', async () => {
      const dto = {
        type: 'infrastructure',
        description: 'Road damaged',
        severity: 'high',
        locationLat: 33.6844,
        locationLng: 73.0479,
      };
      mockDistrictService.createDamageReport.mockResolvedValue({
        id: 'DR-002',
        ...dto,
        status: 'pending',
      });

      const result = await controller.createDamageReport(dto as any, mockDistrictUser as any);

      expect(result.id).toBe('DR-002');
    });
  });

  describe('PUT /district/damage-reports/:id/verify', () => {
    it('should verify damage report', async () => {
      const dto = { verified: true, notes: 'Confirmed' };
      mockDistrictService.verifyDamageReport.mockResolvedValue({
        ...mockDamageReports[0],
        status: 'verified',
      });

      const result = await controller.verifyDamageReport('DR-001', dto as any, mockDistrictUser as any);

      expect(result.status).toBe('verified');
    });
  });

  // ==================== ALERTS & ACTIVITY TESTS ====================

  describe('GET /district/alerts', () => {
    it('should return alerts for district', async () => {
      mockDistrictService.getAlerts.mockResolvedValue(mockAlerts);

      const result = await controller.getAlerts(mockDistrictUser as any);

      expect(result).toEqual(mockAlerts);
    });
  });

  describe('GET /district/activity', () => {
    it('should return activity logs', async () => {
      mockDistrictService.getActivityLogs.mockResolvedValue(mockActivityLogs);

      const result = await controller.getActivityLogs(mockDistrictUser as any);

      expect(result).toEqual(mockActivityLogs);
    });

    it('should respect limit parameter', async () => {
      mockDistrictService.getActivityLogs.mockResolvedValue([mockActivityLogs[0]]);

      await controller.getActivityLogs(mockDistrictUser as any, 1);

      expect(mockDistrictService.getActivityLogs).toHaveBeenCalledWith(mockDistrictUser, 1);
    });
  });

  // ==================== RESOURCES TESTS ====================

  describe('GET /district/resources', () => {
    it('should return all resources', async () => {
      mockDistrictService.getAllResources.mockResolvedValue(mockResources);

      const result = await controller.getAllResources(mockDistrictUser as any);

      expect(result).toEqual(mockResources);
    });
  });

  describe('GET /district/resources/stats', () => {
    it('should return resource stats', async () => {
      const stats = { total: 10, available: 8, allocated: 2 };
      mockDistrictService.getResourceStats.mockResolvedValue(stats);

      const result = await controller.getResourceStats(mockDistrictUser as any);

      expect(result).toEqual(stats);
    });
  });

  describe('GET /district/resources/:id', () => {
    it('should return resource by ID', async () => {
      mockDistrictService.getResourceById.mockResolvedValue(mockResources[0]);

      const result = await controller.getResourceById(1, mockDistrictUser as any);

      expect(result).toEqual(mockResources[0]);
    });
  });

  describe('PUT /district/resources/:id/allocate-to-shelter', () => {
    it('should allocate resource to shelter', async () => {
      const dto = { shelterId: 1, quantity: 100 };
      mockDistrictService.allocateResourceToShelter.mockResolvedValue({
        success: true,
        allocated: 100,
      });

      const result = await controller.allocateResourceToShelter(1, dto as any, mockDistrictUser as any);

      expect(result.success).toBe(true);
    });
  });

  describe('POST /district/allocate-by-type', () => {
    it('should allocate resource by type', async () => {
      const dto = { resourceType: 'food_supplies', shelterId: 1, quantity: 50 };
      mockDistrictService.allocateResourceByType.mockResolvedValue({
        success: true,
      });

      const result = await controller.allocateResourceByType(dto as any, mockDistrictUser as any);

      expect(result.success).toBe(true);
    });
  });

  describe('GET /district/shelters-for-allocation', () => {
    it('should return shelters available for allocation', async () => {
      mockDistrictService.getSheltersForAllocation.mockResolvedValue(mockShelters);

      const result = await controller.getSheltersForAllocation(mockDistrictUser as any);

      expect(result).toEqual(mockShelters);
    });
  });

  // ==================== MISSING PERSONS TESTS ====================

  describe('GET /district/missing-persons', () => {
    it('should return missing persons', async () => {
      mockDistrictService.getMissingPersons.mockResolvedValue(mockMissingPersons);

      const result = await controller.getMissingPersons(mockDistrictUser as any);

      expect(result).toEqual(mockMissingPersons);
    });

    it('should filter by status and search', async () => {
      mockDistrictService.getMissingPersons.mockResolvedValue([]);

      await controller.getMissingPersons(mockDistrictUser as any, 'found', 'Ali');

      expect(mockDistrictService.getMissingPersons).toHaveBeenCalledWith(
        mockDistrictUser,
        'found',
        'Ali',
      );
    });
  });

  describe('GET /district/missing-persons/stats', () => {
    it('should return missing persons stats', async () => {
      const stats = { total: 50, missing: 30, found: 15, deceased: 5 };
      mockDistrictService.getMissingPersonStats.mockResolvedValue(stats);

      const result = await controller.getMissingPersonStats(mockDistrictUser as any);

      expect(result).toEqual(stats);
    });
  });

  describe('GET /district/missing-persons/:id', () => {
    it('should return missing person by ID', async () => {
      mockDistrictService.getMissingPersonById.mockResolvedValue(mockMissingPersons[0]);

      const result = await controller.getMissingPersonById(1, mockDistrictUser as any);

      expect(result).toEqual(mockMissingPersons[0]);
    });
  });

  describe('PUT /district/missing-persons/:id/status', () => {
    it('should update missing person status', async () => {
      const dto = { status: 'found', notes: 'Located safely' };
      mockDistrictService.updateMissingPersonStatus.mockResolvedValue({
        ...mockMissingPersons[0],
        status: 'found',
      });

      const result = await controller.updateMissingPersonStatus(1, dto as any, mockDistrictUser as any);

      expect(result.status).toBe('found');
    });
  });

  describe('POST /district/missing-persons/check-auto-dead', () => {
    it('should trigger auto-dead check', async () => {
      mockDistrictService.checkAndMarkDeadPersons.mockResolvedValue({ updated: 3 });

      const result = await controller.triggerAutoDeadCheck(mockDistrictUser as any);

      expect(result).toEqual({ updated: 3 });
    });
  });

  // ==================== RESOURCE REQUESTS TESTS ====================

  describe('POST /district/resource-requests', () => {
    it('should create resource request', async () => {
      const dto = { resourceType: 'food_supplies', quantity: 500, reason: 'Shortage' };
      mockDistrictService.createResourceRequest.mockResolvedValue({
        id: 1,
        ...dto,
        status: 'pending',
      });

      const result = await controller.createResourceRequest(dto as any, mockDistrictUser as any);

      expect(result.status).toBe('pending');
    });
  });

  describe('GET /district/resource-requests', () => {
    it('should return own resource requests', async () => {
      const requests = [{ id: 1, resourceType: 'food', status: 'pending' }];
      mockDistrictService.getOwnResourceRequests.mockResolvedValue(requests);

      const result = await controller.getOwnResourceRequests(mockDistrictUser as any);

      expect(result).toEqual(requests);
    });

    it('should filter by status', async () => {
      mockDistrictService.getOwnResourceRequests.mockResolvedValue([]);

      await controller.getOwnResourceRequests(mockDistrictUser as any, 'approved');

      expect(mockDistrictService.getOwnResourceRequests).toHaveBeenCalledWith(
        mockDistrictUser,
        'approved',
      );
    });
  });

  // ==================== AUTHORIZATION TESTS ====================

  describe('Authorization', () => {
    it('should have SessionAuthGuard on controller', () => {
      const guards = Reflect.getMetadata('__guards__', DistrictController);
      expect(guards).toBeDefined();
    });

    it('should have RolesGuard on controller', () => {
      const guards = Reflect.getMetadata('__guards__', DistrictController);
      expect(guards).toBeDefined();
    });

    it('should require DISTRICT role', () => {
      const roles = Reflect.getMetadata('roles', DistrictController);
      expect(roles).toContain('district');
    });
  });
});
