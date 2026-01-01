/**
 * PDMA Controller Test Suite
 *
 * Tests for PDMA (Provincial Disaster Management Authority) endpoints:
 * - Dashboard & District management
 * - Alert management
 * - Shelter management
 * - Resource management
 * - SOS oversight
 * - Rescue team management
 * - Resource requests
 * - Provincial map
 *
 * Coverage: Provincial-level operations, district coordination
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PdmaController } from './pdma.controller';
import { PdmaService } from './pdma.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  mockPdmaUser,
  mockDistricts,
  mockAlerts,
  mockShelters,
  mockResources,
  mockSosRequests,
  mockRescueTeams,
  mockDashboardStats,
  mockActivityLogs,
  createValidAlertDto,
  createValidShelterDto,
  createValidResourceDto,
} from '../test-utils';

describe('PdmaController', () => {
  let controller: PdmaController;
  let pdmaService: jest.Mocked<PdmaService>;

  const mockPdmaService = {
    // Dashboard
    getDashboardStats: jest.fn(),
    // Districts
    getAllDistricts: jest.fn(),
    getDistrictById: jest.fn(),
    getDistrictStats: jest.fn(),
    // Alerts
    getAllAlerts: jest.fn(),
    createAlert: jest.fn(),
    resolveAlert: jest.fn(),
    deleteAlert: jest.fn(),
    // Shelters
    getAllShelters: jest.fn(),
    getShelterStats: jest.fn(),
    getShelterById: jest.fn(),
    createShelter: jest.fn(),
    updateShelter: jest.fn(),
    deleteShelter: jest.fn(),
    // Resources
    getAllResources: jest.fn(),
    getResourceStats: jest.fn(),
    getDistrictResourceStock: jest.fn(),
    createResource: jest.fn(),
    updateResource: jest.fn(),
    allocateResource: jest.fn(),
    allocateResourceByType: jest.fn(),
    // Resource Requests
    createResourceRequest: jest.fn(),
    getOwnResourceRequests: jest.fn(),
    getDistrictRequests: jest.fn(),
    reviewDistrictRequest: jest.fn(),
    // SOS
    getAllSosRequests: jest.fn(),
    getSosRequestById: jest.fn(),
    assignTeamToSos: jest.fn(),
    // Rescue Teams
    getAllRescueTeams: jest.fn(),
    getRescueTeamById: jest.fn(),
    // Activity
    getActivityLogs: jest.fn(),
    // Map
    getMapData: jest.fn(),
    // Flood Zones
    getFloodZones: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdmaController],
      providers: [{ provide: PdmaService, useValue: mockPdmaService }],
    })
      .overrideGuard(SessionAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PdmaController>(PdmaController);
    pdmaService = module.get(PdmaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== DASHBOARD TESTS ====================

  describe('GET /pdma/dashboard/stats', () => {
    it('should return provincial dashboard stats', async () => {
      mockPdmaService.getDashboardStats.mockResolvedValue(mockDashboardStats);

      const result = await controller.getDashboardStats(mockPdmaUser as any);

      expect(result).toEqual(mockDashboardStats);
    });

    it('should return stats scoped to user province', async () => {
      const provincialStats = { ...mockDashboardStats, provinceId: 1 };
      mockPdmaService.getDashboardStats.mockResolvedValue(provincialStats);

      const result = await controller.getDashboardStats(mockPdmaUser as any);

      expect(mockPdmaService.getDashboardStats).toHaveBeenCalledWith(
        mockPdmaUser,
      );
    });
  });

  // ==================== DISTRICTS TESTS ====================

  describe('GET /pdma/districts', () => {
    it('should return all districts in province', async () => {
      mockPdmaService.getAllDistricts.mockResolvedValue(mockDistricts);

      const result = await controller.getAllDistricts(mockPdmaUser as any);

      expect(result).toEqual(mockDistricts);
    });
  });

  describe('GET /pdma/districts/:id', () => {
    it('should return district by ID', async () => {
      mockPdmaService.getDistrictById.mockResolvedValue(mockDistricts[0]);

      const result = await controller.getDistrictById(1, mockPdmaUser as any);

      expect(result).toEqual(mockDistricts[0]);
    });

    it('should throw NotFoundException for invalid district', async () => {
      mockPdmaService.getDistrictById.mockRejectedValue(
        new NotFoundException('District not found'),
      );

      await expect(
        controller.getDistrictById(999, mockPdmaUser as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /pdma/districts/:id/stats', () => {
    it('should return district stats', async () => {
      const stats = { sosRequests: 50, shelters: 10, resources: 200 };
      mockPdmaService.getDistrictStats.mockResolvedValue(stats);

      const result = await controller.getDistrictStats(1, mockPdmaUser as any);

      expect(result).toEqual(stats);
    });
  });

  // ==================== ALERTS TESTS ====================

  describe('GET /pdma/alerts', () => {
    it('should return all alerts in province', async () => {
      mockPdmaService.getAllAlerts.mockResolvedValue(mockAlerts);

      const result = await controller.getAllAlerts(mockPdmaUser as any);

      expect(result).toEqual(mockAlerts);
    });

    it('should filter by status and severity', async () => {
      mockPdmaService.getAllAlerts.mockResolvedValue([mockAlerts[0]]);

      await controller.getAllAlerts(mockPdmaUser as any, 'active', 'high');

      expect(mockPdmaService.getAllAlerts).toHaveBeenCalledWith(
        mockPdmaUser,
        'active',
        'high',
      );
    });
  });

  describe('POST /pdma/alerts', () => {
    it('should create provincial alert', async () => {
      const dto = createValidAlertDto();
      mockPdmaService.createAlert.mockResolvedValue({
        id: 1,
        ...dto,
        status: 'active',
      });

      const result = await controller.createAlert(
        dto as any,
        mockPdmaUser as any,
      );

      expect(result.id).toBe(1);
    });
  });

  describe('PUT /pdma/alerts/:id/resolve', () => {
    it('should resolve alert', async () => {
      mockPdmaService.resolveAlert.mockResolvedValue({
        ...mockAlerts[0],
        status: 'resolved',
      });

      const result = await controller.resolveAlert(1, mockPdmaUser as any);

      expect(result.status).toBe('resolved');
    });
  });

  describe('DELETE /pdma/alerts/:id', () => {
    it('should delete alert', async () => {
      mockPdmaService.deleteAlert.mockResolvedValue(undefined);

      await controller.deleteAlert(1, mockPdmaUser as any);

      expect(mockPdmaService.deleteAlert).toHaveBeenCalledWith(1, mockPdmaUser);
    });
  });

  // ==================== SHELTERS TESTS ====================

  describe('GET /pdma/shelters', () => {
    it('should return all shelters in province', async () => {
      mockPdmaService.getAllShelters.mockResolvedValue(mockShelters);

      const result = await controller.getAllShelters(mockPdmaUser as any);

      expect(result).toEqual(mockShelters);
    });

    it('should filter by status', async () => {
      mockPdmaService.getAllShelters.mockResolvedValue([mockShelters[0]]);

      await controller.getAllShelters(mockPdmaUser as any, 'active');

      expect(mockPdmaService.getAllShelters).toHaveBeenCalledWith(
        mockPdmaUser,
        'active',
      );
    });
  });

  describe('GET /pdma/shelters/stats', () => {
    it('should return provincial shelter stats', async () => {
      const stats = { total: 50, active: 45, full: 5 };
      mockPdmaService.getShelterStats.mockResolvedValue(stats);

      const result = await controller.getShelterStats(mockPdmaUser as any);

      expect(result).toEqual(stats);
    });
  });

  describe('GET /pdma/shelters/:id', () => {
    it('should return shelter by ID', async () => {
      mockPdmaService.getShelterById.mockResolvedValue(mockShelters[0]);

      const result = await controller.getShelterById(1, mockPdmaUser as any);

      expect(result).toEqual(mockShelters[0]);
    });
  });

  describe('POST /pdma/shelters', () => {
    it('should create shelter', async () => {
      const dto = createValidShelterDto();
      mockPdmaService.createShelter.mockResolvedValue({
        id: 3,
        ...dto,
        status: 'active',
      });

      const result = await controller.createShelter(
        dto as any,
        mockPdmaUser as any,
      );

      expect(result.name).toBe('New Shelter');
    });
  });

  describe('PUT /pdma/shelters/:id', () => {
    it('should update shelter', async () => {
      const dto = { capacity: 400 };
      mockPdmaService.updateShelter.mockResolvedValue({
        ...mockShelters[0],
        capacity: 400,
      });

      const result = await controller.updateShelter(
        1,
        dto as any,
        mockPdmaUser as any,
      );

      expect(result.capacity).toBe(400);
    });
  });

  describe('DELETE /pdma/shelters/:id', () => {
    it('should delete shelter', async () => {
      mockPdmaService.deleteShelter.mockResolvedValue(undefined);

      await controller.deleteShelter(1, mockPdmaUser as any);

      expect(mockPdmaService.deleteShelter).toHaveBeenCalledWith(
        1,
        mockPdmaUser,
      );
    });
  });

  // ==================== RESOURCES TESTS ====================

  describe('GET /pdma/resources', () => {
    it('should return all resources in province', async () => {
      mockPdmaService.getAllResources.mockResolvedValue(mockResources);

      const result = await controller.getAllResources(mockPdmaUser as any);

      expect(result).toEqual(mockResources);
    });
  });

  describe('GET /pdma/resources/stats', () => {
    it('should return resource stats', async () => {
      const stats = { total: 20, available: 15 };
      mockPdmaService.getResourceStats.mockResolvedValue(stats);

      const result = await controller.getResourceStats(mockPdmaUser as any);

      expect(result).toEqual(stats);
    });
  });

  describe('GET /pdma/resources/district-stock', () => {
    it('should return district resource stock', async () => {
      const stock = mockDistricts.map((d) => ({
        districtId: d.id,
        resources: mockResources,
      }));
      mockPdmaService.getDistrictResourceStock.mockResolvedValue(stock);

      const result = await controller.getDistrictResourceStock(
        mockPdmaUser as any,
      );

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('POST /pdma/resources', () => {
    it('should create resource', async () => {
      const dto = createValidResourceDto();
      mockPdmaService.createResource.mockResolvedValue({ id: 3, ...dto });

      const result = await controller.createResource(
        dto as any,
        mockPdmaUser as any,
      );

      expect(result.type).toBe('food_supplies');
    });
  });

  describe('PUT /pdma/resources/:id', () => {
    it('should update resource', async () => {
      const dto = { quantity: 2000 };
      mockPdmaService.updateResource.mockResolvedValue({
        ...mockResources[0],
        quantity: 2000,
      });

      const result = await controller.updateResource(
        1,
        dto as any,
        mockPdmaUser as any,
      );

      expect(result.quantity).toBe(2000);
    });
  });

  describe('POST /pdma/resources/:id/allocate', () => {
    it('should allocate resource to district', async () => {
      const dto = { districtId: 1, quantity: 100 };
      mockPdmaService.allocateResource.mockResolvedValue({ success: true });

      const result = await controller.allocateResource(
        1,
        dto as any,
        mockPdmaUser as any,
      );

      expect(result.success).toBe(true);
    });
  });

  describe('POST /pdma/allocate-by-type', () => {
    it('should allocate resource by type', async () => {
      const dto = {
        resourceType: 'food_supplies',
        districtId: 1,
        quantity: 200,
      };
      mockPdmaService.allocateResourceByType.mockResolvedValue({
        success: true,
      });

      const result = await controller.allocateResourceByType(
        dto as any,
        mockPdmaUser as any,
      );

      expect(result.success).toBe(true);
    });
  });

  // ==================== RESOURCE REQUESTS TESTS ====================

  describe('POST /pdma/resource-requests', () => {
    it('should create resource request to NDMA', async () => {
      const dto = { resourceType: 'medical_supplies', quantity: 1000 };
      mockPdmaService.createResourceRequest.mockResolvedValue({
        id: 1,
        ...dto,
        status: 'pending',
      });

      const result = await controller.createResourceRequest(
        dto as any,
        mockPdmaUser as any,
      );

      expect(result.status).toBe('pending');
    });
  });

  describe('GET /pdma/resource-requests', () => {
    it('should return own resource requests', async () => {
      const requests = [{ id: 1, resourceType: 'food', status: 'pending' }];
      mockPdmaService.getOwnResourceRequests.mockResolvedValue(requests);

      const result = await controller.getOwnResourceRequests(
        mockPdmaUser as any,
      );

      expect(result).toEqual(requests);
    });
  });

  describe('GET /pdma/district-requests', () => {
    it('should return requests from districts', async () => {
      const requests = [
        { id: 1, districtId: 1, resourceType: 'food', status: 'pending' },
      ];
      mockPdmaService.getDistrictRequests.mockResolvedValue(requests);

      const result = await controller.getDistrictRequests(mockPdmaUser as any);

      expect(result).toEqual(requests);
    });
  });

  describe('PUT /pdma/district-requests/:id/review', () => {
    it('should review district request', async () => {
      const dto = { status: 'approved', notes: 'Approved' };
      mockPdmaService.reviewDistrictRequest.mockResolvedValue({
        id: 1,
        status: 'approved',
      });

      const result = await controller.reviewDistrictRequest(
        1,
        dto,
        mockPdmaUser as any,
      );

      expect(result.status).toBe('approved');
    });
  });

  // ==================== SOS REQUESTS TESTS ====================

  describe('GET /pdma/sos-requests', () => {
    it('should return all SOS requests in province', async () => {
      mockPdmaService.getAllSosRequests.mockResolvedValue(mockSosRequests);

      const result = await controller.getAllSosRequests(mockPdmaUser as any);

      expect(result).toEqual(mockSosRequests);
    });

    it('should filter by status', async () => {
      mockPdmaService.getAllSosRequests.mockResolvedValue([mockSosRequests[0]]);

      await controller.getAllSosRequests(mockPdmaUser as any, 'pending');

      expect(mockPdmaService.getAllSosRequests).toHaveBeenCalledWith(
        mockPdmaUser,
        'pending',
      );
    });
  });

  describe('GET /pdma/sos-requests/:id', () => {
    it('should return SOS request by ID', async () => {
      mockPdmaService.getSosRequestById.mockResolvedValue(mockSosRequests[0]);

      const result = await controller.getSosRequestById(
        'SOS-001',
        mockPdmaUser as any,
      );

      expect(result).toEqual(mockSosRequests[0]);
    });
  });

  describe('PUT /pdma/sos-requests/:id/assign-team', () => {
    it('should assign team to SOS request', async () => {
      const dto = { teamId: 'RT-001' };
      mockPdmaService.assignTeamToSos.mockResolvedValue({
        ...mockSosRequests[0],
        assignedTeamId: 'RT-001',
      });

      const result = await controller.assignTeamToSos(
        'SOS-001',
        dto as any,
        mockPdmaUser as any,
      );

      expect(result.assignedTeamId).toBe('RT-001');
    });
  });

  // ==================== RESCUE TEAMS TESTS ====================

  describe('GET /pdma/rescue-teams', () => {
    it('should return all rescue teams in province', async () => {
      mockPdmaService.getAllRescueTeams.mockResolvedValue(mockRescueTeams);

      const result = await controller.getAllRescueTeams(mockPdmaUser as any);

      expect(result).toEqual(mockRescueTeams);
    });

    it('should filter by status', async () => {
      mockPdmaService.getAllRescueTeams.mockResolvedValue([mockRescueTeams[0]]);

      await controller.getAllRescueTeams(mockPdmaUser as any, 'available');

      expect(mockPdmaService.getAllRescueTeams).toHaveBeenCalledWith(
        mockPdmaUser,
        'available',
      );
    });
  });

  describe('GET /pdma/rescue-teams/:id', () => {
    it('should return rescue team by ID', async () => {
      mockPdmaService.getRescueTeamById.mockResolvedValue(mockRescueTeams[0]);

      const result = await controller.getRescueTeamById(
        'RT-001',
        mockPdmaUser as any,
      );

      expect(result).toEqual(mockRescueTeams[0]);
    });
  });

  // ==================== ACTIVITY LOGS TESTS ====================

  describe('GET /pdma/activity-logs', () => {
    it('should return activity logs', async () => {
      mockPdmaService.getActivityLogs.mockResolvedValue(mockActivityLogs);

      const result = await controller.getActivityLogs(mockPdmaUser as any);

      expect(result).toEqual(mockActivityLogs);
    });

    it('should respect limit parameter', async () => {
      mockPdmaService.getActivityLogs.mockResolvedValue([mockActivityLogs[0]]);

      await controller.getActivityLogs(mockPdmaUser as any, '10');

      expect(mockPdmaService.getActivityLogs).toHaveBeenCalledWith(
        mockPdmaUser,
        10,
      );
    });
  });

  // ==================== MAP DATA TESTS ====================

  describe('GET /pdma/map/data', () => {
    it('should return provincial map data', async () => {
      const mapData = { markers: [], polygons: [], districts: mockDistricts };
      mockPdmaService.getMapData.mockResolvedValue(mapData);

      const result = await controller.getMapData(mockPdmaUser as any);

      expect(result).toEqual(mapData);
    });
  });

  // ==================== FLOOD ZONES TESTS ====================

  describe('GET /pdma/flood-zones', () => {
    it('should return flood zones', async () => {
      const zones = [
        { id: 1, name: 'Zone A', riskLevel: 'high' },
        { id: 2, name: 'Zone B', riskLevel: 'medium' },
      ];
      mockPdmaService.getFloodZones.mockResolvedValue(zones);

      const result = await controller.getFloodZones(mockPdmaUser as any);

      expect(result).toEqual(zones);
    });
  });

  // ==================== AUTHORIZATION TESTS ====================

  describe('Authorization', () => {
    it('should require PDMA role', () => {
      const roles = Reflect.getMetadata('roles', PdmaController);
      expect(roles).toContain('pdma');
    });

    it('should have guards on controller', () => {
      const guards = Reflect.getMetadata('__guards__', PdmaController);
      expect(guards).toBeDefined();
    });
  });
});
