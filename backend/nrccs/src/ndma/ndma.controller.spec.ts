/**
 * NDMA Controller Test Suite
 * 
 * Tests for NDMA (National Disaster Management Authority) endpoints:
 * - Dashboard & Province management
 * - District oversight
 * - Alert management
 * - Shelter monitoring
 * - Resource allocation (national)
 * - SOS oversight
 * - Flood prediction
 * - Map data
 * 
 * Coverage: National-level operations, ML integration, cross-province data
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { NdmaController } from './ndma.controller';
import { NdmaService } from './ndma.service';
import { FloodPredictionService } from './flood-prediction/flood-prediction.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  mockNdmaUser,
  mockProvinces,
  mockDistricts,
  mockAlerts,
  mockShelters,
  mockResources,
  mockSosRequests,
  mockRescueTeams,
  mockDashboardStats,
  mockActivityLogs,
  mockFloodPrediction,
  createValidAlertDto,
  createValidFloodPredictionDto,
} from '../test-utils';

describe('NdmaController', () => {
  let controller: NdmaController;
  let ndmaService: jest.Mocked<NdmaService>;
  let floodPredictionService: jest.Mocked<FloodPredictionService>;

  const mockNdmaService = {
    // Dashboard
    getDashboardStats: jest.fn(),
    getProvinceSummaries: jest.fn(),
    // Provinces
    getAllProvinces: jest.fn(),
    getProvinceById: jest.fn(),
    getProvinceStats: jest.fn(),
    // Districts
    getAllDistricts: jest.fn(),
    getDistrictById: jest.fn(),
    // Alerts
    getAllAlerts: jest.fn(),
    createAlert: jest.fn(),
    resolveAlert: jest.fn(),
    deleteAlert: jest.fn(),
    createAlertFromPrediction: jest.fn(),
    // Shelters
    getAllShelters: jest.fn(),
    getShelterStats: jest.fn(),
    // Resources
    getAllResources: jest.fn(),
    getResourceStats: jest.fn(),
    getResourcesByProvince: jest.fn(),
    getNationalResources: jest.fn(),
    createNationalResource: jest.fn(),
    increaseNationalStock: jest.fn(),
    allocateResourceToProvince: jest.fn(),
    allocateResourceByType: jest.fn(),
    getResourceRequests: jest.fn(),
    reviewResourceRequest: jest.fn(),
    getNdmaAllocationHistory: jest.fn(),
    // SOS
    getAllSosRequests: jest.fn(),
    getSosStats: jest.fn(),
    getSosRequestById: jest.fn(),
    // Rescue Teams
    getAllRescueTeams: jest.fn(),
    getRescueTeamStats: jest.fn(),
    // Activity
    getActivityLogs: jest.fn(),
    // Flood/Map
    getFloodZones: jest.fn(),
    getMapData: jest.fn(),
    getMapProvinceData: jest.fn(),
  };

  const mockFloodPredictionService = {
    predict: jest.fn(),
    getSimulationScenarios: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NdmaController],
      providers: [
        { provide: NdmaService, useValue: mockNdmaService },
        { provide: FloodPredictionService, useValue: mockFloodPredictionService },
      ],
    })
      .overrideGuard(SessionAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<NdmaController>(NdmaController);
    ndmaService = module.get(NdmaService);
    floodPredictionService = module.get(FloodPredictionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== DASHBOARD TESTS ====================

  describe('GET /ndma/dashboard/stats', () => {
    it('should return national dashboard stats', async () => {
      mockNdmaService.getDashboardStats.mockResolvedValue(mockDashboardStats);

      const result = await controller.getDashboardStats(mockNdmaUser as any);

      expect(result).toEqual(mockDashboardStats);
    });

    it('should handle service error', async () => {
      mockNdmaService.getDashboardStats.mockRejectedValue(new Error('Stats error'));

      await expect(controller.getDashboardStats(mockNdmaUser as any)).rejects.toThrow('Stats error');
    });
  });

  describe('GET /ndma/dashboard/provinces', () => {
    it('should return province summaries', async () => {
      const summaries = mockProvinces.map((p) => ({ ...p, sosCount: 10, shelterCount: 5 }));
      mockNdmaService.getProvinceSummaries.mockResolvedValue(summaries);

      const result = await controller.getProvinceSummaries(mockNdmaUser as any);

      expect(result.length).toBe(4);
    });
  });

  // ==================== PROVINCES TESTS ====================

  describe('GET /ndma/provinces', () => {
    it('should return all provinces', async () => {
      mockNdmaService.getAllProvinces.mockResolvedValue(mockProvinces);

      const result = await controller.getAllProvinces(mockNdmaUser as any);

      expect(result).toEqual(mockProvinces);
    });
  });

  describe('GET /ndma/provinces/:id', () => {
    it('should return province by ID', async () => {
      mockNdmaService.getProvinceById.mockResolvedValue(mockProvinces[0]);

      const result = await controller.getProvinceById(1, mockNdmaUser as any);

      expect(result).toEqual(mockProvinces[0]);
    });

    it('should throw NotFoundException for invalid ID', async () => {
      mockNdmaService.getProvinceById.mockRejectedValue(new NotFoundException('Province not found'));

      await expect(controller.getProvinceById(999, mockNdmaUser as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /ndma/provinces/:id/stats', () => {
    it('should return province stats', async () => {
      const stats = { sosRequests: 100, shelters: 20, resources: 500 };
      mockNdmaService.getProvinceStats.mockResolvedValue(stats);

      const result = await controller.getProvinceStats(1, mockNdmaUser as any);

      expect(result).toEqual(stats);
    });
  });

  // ==================== DISTRICTS TESTS ====================

  describe('GET /ndma/districts', () => {
    it('should return all districts', async () => {
      mockNdmaService.getAllDistricts.mockResolvedValue(mockDistricts);

      const result = await controller.getAllDistricts(mockNdmaUser as any);

      expect(result).toEqual(mockDistricts);
    });

    it('should filter by province', async () => {
      mockNdmaService.getAllDistricts.mockResolvedValue([mockDistricts[0]]);

      await controller.getAllDistricts(mockNdmaUser as any, '1');

      expect(mockNdmaService.getAllDistricts).toHaveBeenCalledWith(mockNdmaUser, 1, undefined);
    });

    it('should filter by risk level', async () => {
      mockNdmaService.getAllDistricts.mockResolvedValue([]);

      await controller.getAllDistricts(mockNdmaUser as any, undefined, 'high');

      expect(mockNdmaService.getAllDistricts).toHaveBeenCalledWith(mockNdmaUser, undefined, 'high');
    });
  });

  describe('GET /ndma/districts/:id', () => {
    it('should return district by ID', async () => {
      mockNdmaService.getDistrictById.mockResolvedValue(mockDistricts[0]);

      const result = await controller.getDistrictById(1, mockNdmaUser as any);

      expect(result).toEqual(mockDistricts[0]);
    });
  });

  // ==================== ALERTS TESTS ====================

  describe('GET /ndma/alerts', () => {
    it('should return all alerts', async () => {
      mockNdmaService.getAllAlerts.mockResolvedValue(mockAlerts);

      const result = await controller.getAllAlerts(mockNdmaUser as any);

      expect(result).toEqual(mockAlerts);
    });

    it('should filter by status and severity', async () => {
      mockNdmaService.getAllAlerts.mockResolvedValue([mockAlerts[0]]);

      await controller.getAllAlerts(mockNdmaUser as any, 'active', 'high', '1');

      expect(mockNdmaService.getAllAlerts).toHaveBeenCalledWith(mockNdmaUser, 'active', 'high', 1);
    });
  });

  describe('POST /ndma/alerts', () => {
    it('should create alert successfully', async () => {
      const dto = createValidAlertDto();
      mockNdmaService.createAlert.mockResolvedValue({ id: 1, ...dto, status: 'active' });

      const result = await controller.createAlert(dto as any, mockNdmaUser as any);

      expect(result.id).toBe(1);
      expect(result.status).toBe('active');
    });

    it('should create alert with multiple districts', async () => {
      const dto = { ...createValidAlertDto(), districtIds: [1, 2, 3, 4, 5] };
      mockNdmaService.createAlert.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.createAlert(dto as any, mockNdmaUser as any);

      expect(result.districtIds.length).toBe(5);
    });
  });

  describe('PUT /ndma/alerts/:id/resolve', () => {
    it('should resolve alert', async () => {
      mockNdmaService.resolveAlert.mockResolvedValue({ ...mockAlerts[0], status: 'resolved' });

      const result = await controller.resolveAlert(1, mockNdmaUser as any);

      expect(result.status).toBe('resolved');
    });

    it('should throw NotFoundException for invalid alert', async () => {
      mockNdmaService.resolveAlert.mockRejectedValue(new NotFoundException('Alert not found'));

      await expect(controller.resolveAlert(999, mockNdmaUser as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /ndma/alerts/:id', () => {
    it('should delete alert', async () => {
      mockNdmaService.deleteAlert.mockResolvedValue(undefined);

      await controller.deleteAlert(1, mockNdmaUser as any);

      expect(mockNdmaService.deleteAlert).toHaveBeenCalledWith(1, mockNdmaUser);
    });
  });

  // ==================== SHELTERS TESTS ====================

  describe('GET /ndma/shelters', () => {
    it('should return all shelters nationally', async () => {
      mockNdmaService.getAllShelters.mockResolvedValue(mockShelters);

      const result = await controller.getAllShelters(mockNdmaUser as any);

      expect(result).toEqual(mockShelters);
    });

    it('should filter by status and province', async () => {
      mockNdmaService.getAllShelters.mockResolvedValue([mockShelters[0]]);

      await controller.getAllShelters(mockNdmaUser as any, 'active', '1');

      expect(mockNdmaService.getAllShelters).toHaveBeenCalledWith(mockNdmaUser, 'active', 1);
    });
  });

  describe('GET /ndma/shelters/stats', () => {
    it('should return national shelter stats', async () => {
      const stats = { total: 500, totalCapacity: 100000, currentOccupancy: 45000 };
      mockNdmaService.getShelterStats.mockResolvedValue(stats);

      const result = await controller.getShelterStats(mockNdmaUser as any);

      expect(result).toEqual(stats);
    });
  });

  // ==================== RESOURCES TESTS ====================

  describe('GET /ndma/resources', () => {
    it('should return all resources', async () => {
      mockNdmaService.getAllResources.mockResolvedValue(mockResources);

      const result = await controller.getAllResources(mockNdmaUser as any);

      expect(result).toEqual(mockResources);
    });

    it('should filter by status and type', async () => {
      mockNdmaService.getAllResources.mockResolvedValue([mockResources[0]]);

      await controller.getAllResources(mockNdmaUser as any, 'available', 'food_supplies');

      expect(mockNdmaService.getAllResources).toHaveBeenCalledWith(mockNdmaUser, 'available', 'food_supplies');
    });
  });

  describe('GET /ndma/resources/stats', () => {
    it('should return resource stats', async () => {
      const stats = { totalTypes: 10, totalQuantity: 50000, allocated: 20000 };
      mockNdmaService.getResourceStats.mockResolvedValue(stats);

      const result = await controller.getResourceStats(mockNdmaUser as any);

      expect(result).toEqual(stats);
    });
  });

  describe('GET /ndma/resources/by-province', () => {
    it('should return resources grouped by province', async () => {
      const byProvince = [
        { provinceId: 1, resources: mockResources },
        { provinceId: 2, resources: [] },
      ];
      mockNdmaService.getResourcesByProvince.mockResolvedValue(byProvince);

      const result = await controller.getResourcesByProvince(mockNdmaUser as any);

      expect(result.length).toBe(2);
    });
  });

  describe('GET /ndma/resources/national', () => {
    it('should return national resources', async () => {
      mockNdmaService.getNationalResources.mockResolvedValue(mockResources);

      const result = await controller.getNationalResources(mockNdmaUser as any);

      expect(result).toEqual(mockResources);
    });
  });

  describe('POST /ndma/resources', () => {
    it('should create national resource', async () => {
      const dto = { type: 'food_supplies', name: 'Rice', quantity: 10000, unit: 'kg' };
      mockNdmaService.createNationalResource.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.createNationalResource(dto as any, mockNdmaUser as any);

      expect(result.id).toBe(1);
    });
  });

  describe('POST /ndma/resources/:id/increase-stock', () => {
    it('should increase national stock', async () => {
      const dto = { quantity: 5000 };
      mockNdmaService.increaseNationalStock.mockResolvedValue({
        ...mockResources[0],
        quantity: 6000,
      });

      const result = await controller.increaseNationalStock(1, dto as any, mockNdmaUser as any);

      expect(result.quantity).toBe(6000);
    });
  });

  describe('POST /ndma/resources/:id/allocate', () => {
    it('should allocate resource to province', async () => {
      const dto = { provinceId: 1, quantity: 500 };
      mockNdmaService.allocateResourceToProvince.mockResolvedValue({ success: true });

      const result = await controller.allocateResourceToProvince(1, dto as any, mockNdmaUser as any);

      expect(result.success).toBe(true);
    });
  });

  describe('POST /ndma/allocate-by-type', () => {
    it('should allocate by resource type', async () => {
      const dto = { resourceType: 'food_supplies', provinceId: 1, quantity: 1000 };
      mockNdmaService.allocateResourceByType.mockResolvedValue({ success: true });

      const result = await controller.allocateResourceByType(dto as any, mockNdmaUser as any);

      expect(result.success).toBe(true);
    });
  });

  describe('GET /ndma/resource-requests', () => {
    it('should return resource requests', async () => {
      const requests = [{ id: 1, type: 'food', status: 'pending' }];
      mockNdmaService.getResourceRequests.mockResolvedValue(requests);

      const result = await controller.getResourceRequests(mockNdmaUser as any);

      expect(result).toEqual(requests);
    });
  });

  describe('PUT /ndma/resource-requests/:id/review', () => {
    it('should review resource request', async () => {
      const dto = { status: 'approved', notes: 'Approved' };
      mockNdmaService.reviewResourceRequest.mockResolvedValue({
        id: 1,
        status: 'approved',
      });

      const result = await controller.reviewResourceRequest(1, dto as any, mockNdmaUser as any);

      expect(result.status).toBe('approved');
    });
  });

  describe('GET /ndma/allocations/history', () => {
    it('should return allocation history', async () => {
      const history = [{ id: 1, resourceType: 'food', quantity: 500, date: new Date() }];
      mockNdmaService.getNdmaAllocationHistory.mockResolvedValue(history);

      const result = await controller.getAllocationHistory(mockNdmaUser as any);

      expect(result).toEqual(history);
    });
  });

  // ==================== SOS REQUESTS TESTS ====================

  describe('GET /ndma/sos-requests', () => {
    it('should return all SOS requests nationally', async () => {
      mockNdmaService.getAllSosRequests.mockResolvedValue(mockSosRequests);

      const result = await controller.getAllSosRequests(mockNdmaUser as any);

      expect(result).toEqual(mockSosRequests);
    });

    it('should filter by status, priority, and province', async () => {
      mockNdmaService.getAllSosRequests.mockResolvedValue([mockSosRequests[0]]);

      await controller.getAllSosRequests(mockNdmaUser as any, 'pending', 'high', '1');

      expect(mockNdmaService.getAllSosRequests).toHaveBeenCalledWith(
        mockNdmaUser,
        'pending',
        'high',
        1,
      );
    });
  });

  describe('GET /ndma/sos-requests/stats', () => {
    it('should return SOS stats', async () => {
      const stats = { total: 1000, pending: 200, resolved: 800 };
      mockNdmaService.getSosStats.mockResolvedValue(stats);

      const result = await controller.getSosStats(mockNdmaUser as any);

      expect(result).toEqual(stats);
    });
  });

  describe('GET /ndma/sos-requests/:id', () => {
    it('should return SOS request by ID', async () => {
      mockNdmaService.getSosRequestById.mockResolvedValue(mockSosRequests[0]);

      const result = await controller.getSosRequestById('SOS-001', mockNdmaUser as any);

      expect(result).toEqual(mockSosRequests[0]);
    });
  });

  // ==================== RESCUE TEAMS TESTS ====================

  describe('GET /ndma/rescue-teams', () => {
    it('should return all rescue teams', async () => {
      mockNdmaService.getAllRescueTeams.mockResolvedValue(mockRescueTeams);

      const result = await controller.getAllRescueTeams(mockNdmaUser as any);

      expect(result).toEqual(mockRescueTeams);
    });

    it('should filter by status and province', async () => {
      mockNdmaService.getAllRescueTeams.mockResolvedValue([mockRescueTeams[0]]);

      await controller.getAllRescueTeams(mockNdmaUser as any, 'available', '1');

      expect(mockNdmaService.getAllRescueTeams).toHaveBeenCalledWith(mockNdmaUser, 'available', 1);
    });
  });

  describe('GET /ndma/rescue-teams/stats', () => {
    it('should return rescue team stats', async () => {
      const stats = { total: 100, available: 60, deployed: 40 };
      mockNdmaService.getRescueTeamStats.mockResolvedValue(stats);

      const result = await controller.getRescueTeamStats(mockNdmaUser as any);

      expect(result).toEqual(stats);
    });
  });

  // ==================== ACTIVITY LOGS TESTS ====================

  describe('GET /ndma/activity-logs', () => {
    it('should return activity logs', async () => {
      mockNdmaService.getActivityLogs.mockResolvedValue(mockActivityLogs);

      const result = await controller.getActivityLogs(mockNdmaUser as any);

      expect(result).toEqual(mockActivityLogs);
    });

    it('should filter by limit and type', async () => {
      mockNdmaService.getActivityLogs.mockResolvedValue([mockActivityLogs[0]]);

      await controller.getActivityLogs(mockNdmaUser as any, '10', 'alert');

      expect(mockNdmaService.getActivityLogs).toHaveBeenCalledWith(mockNdmaUser, 10, 'alert');
    });
  });

  // ==================== FLOOD PREDICTION TESTS ====================

  describe('POST /ndma/flood/predict', () => {
    it('should return flood prediction', async () => {
      const dto = createValidFloodPredictionDto();
      mockFloodPredictionService.predict.mockResolvedValue(mockFloodPrediction);

      const result = await controller.predictFlood(dto as any, mockNdmaUser as any);

      expect(result.flood_risk).toBeDefined();
      expect(result.alertGenerated).toBe(false);
    });

    it('should generate alert for high risk prediction', async () => {
      const dto = { ...createValidFloodPredictionDto(), generateAlert: true, provinceId: 1 };
      mockFloodPredictionService.predict.mockResolvedValue({ flood_risk: 'High', confidence: 0.9 });
      mockNdmaService.createAlertFromPrediction.mockResolvedValue({ id: 1 });

      const result = await controller.predictFlood(dto as any, mockNdmaUser as any);

      expect(result.alertGenerated).toBe(true);
      expect(result.alertId).toBe(1);
    });

    it('should not generate alert for low risk', async () => {
      const dto = { ...createValidFloodPredictionDto(), generateAlert: true, provinceId: 1 };
      mockFloodPredictionService.predict.mockResolvedValue({ flood_risk: 'Low', confidence: 0.8 });

      const result = await controller.predictFlood(dto as any, mockNdmaUser as any);

      expect(result.alertGenerated).toBe(false);
    });

    it('should handle prediction service error', async () => {
      const dto = createValidFloodPredictionDto();
      mockFloodPredictionService.predict.mockRejectedValue(new Error('ML service unavailable'));

      await expect(controller.predictFlood(dto as any, mockNdmaUser as any)).rejects.toThrow(
        'ML service unavailable',
      );
    });
  });

  describe('GET /ndma/flood/simulation-scenarios', () => {
    it('should return simulation scenarios', async () => {
      const scenarios = [
        { name: 'Heavy Rain', precipitation: 200 },
        { name: 'Monsoon', precipitation: 300 },
      ];
      mockFloodPredictionService.getSimulationScenarios.mockReturnValue(scenarios);

      const result = await controller.getSimulationScenarios(mockNdmaUser as any);

      expect(result).toEqual(scenarios);
    });
  });

  describe('GET /ndma/flood/zones', () => {
    it('should return flood zones', async () => {
      const zones = [
        { id: 1, name: 'Zone A', riskLevel: 'high' },
        { id: 2, name: 'Zone B', riskLevel: 'medium' },
      ];
      mockNdmaService.getFloodZones.mockResolvedValue(zones);

      const result = await controller.getFloodZones(mockNdmaUser as any);

      expect(result).toEqual(zones);
    });
  });

  // ==================== MAP DATA TESTS ====================

  describe('GET /ndma/map/data', () => {
    it('should return map data', async () => {
      const mapData = { markers: [], polygons: [], layers: [] };
      mockNdmaService.getMapData.mockResolvedValue(mapData);

      const result = await controller.getMapData(mockNdmaUser as any);

      expect(result).toEqual(mapData);
    });
  });

  describe('GET /ndma/map/provinces', () => {
    it('should return province map data', async () => {
      const provinceData = mockProvinces.map((p) => ({ ...p, bounds: [], center: {} }));
      mockNdmaService.getMapProvinceData.mockResolvedValue(provinceData);

      const result = await controller.getMapProvinceData(mockNdmaUser as any);

      expect(result.length).toBe(4);
    });
  });

  // ==================== AUTHORIZATION TESTS ====================

  describe('Authorization', () => {
    it('should require NDMA role', () => {
      const roles = Reflect.getMetadata('roles', NdmaController);
      expect(roles).toContain('ndma');
    });

    it('should have guards on controller', () => {
      const guards = Reflect.getMetadata('__guards__', NdmaController);
      expect(guards).toBeDefined();
    });
  });
});
