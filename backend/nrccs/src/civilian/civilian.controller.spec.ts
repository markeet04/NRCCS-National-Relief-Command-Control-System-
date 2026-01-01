/**
 * Civilian Controller Test Suite
 *
 * Tests for public civilian endpoints (no authentication required):
 * - GET /civilian/alerts
 * - GET /civilian/alerts/recent
 * - GET /civilian/shelters
 * - POST /civilian/sos
 * - GET /civilian/track/:id
 * - GET /civilian/track?cnic=
 * - GET /civilian/missing-persons
 * - POST /civilian/missing-persons
 * - GET /civilian/help
 * - GET /civilian/provinces
 * - GET /civilian/provinces/:provinceId/districts
 *
 * Coverage: Public data access, SOS submission, tracking, missing persons
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CivilianController } from './civilian.controller';
import { CivilianService } from './civilian.service';
import {
  mockAlerts,
  mockShelters,
  mockSosRequests,
  mockMissingPersons,
  mockProvinces,
  mockDistricts,
  createValidSosDto,
  createValidMissingPersonDto,
  invalidPhoneNumbers,
  invalidCnics,
} from '../test-utils';

describe('CivilianController', () => {
  let controller: CivilianController;
  let civilianService: jest.Mocked<CivilianService>;

  const mockCivilianService = {
    getAllAlerts: jest.fn(),
    getRecentAlerts: jest.fn(),
    getAllShelters: jest.fn(),
    createSos: jest.fn(),
    trackRequestById: jest.fn(),
    trackRequestsByCnic: jest.fn(),
    getAllMissingPersons: jest.fn(),
    createMissingPersonReport: jest.fn(),
    getHelpContent: jest.fn(),
    getAllProvinces: jest.fn(),
    getDistrictsByProvince: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CivilianController],
      providers: [
        {
          provide: CivilianService,
          useValue: mockCivilianService,
        },
      ],
    }).compile();

    controller = module.get<CivilianController>(CivilianController);
    civilianService = module.get(CivilianService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== ALERTS TESTS ====================

  describe('GET /civilian/alerts', () => {
    it('should return all alerts successfully', async () => {
      mockCivilianService.getAllAlerts.mockResolvedValue(mockAlerts);

      const result = await controller.getAllAlerts();

      expect(result).toEqual(mockAlerts);
      expect(mockCivilianService.getAllAlerts).toHaveBeenCalledWith(
        undefined,
        50,
      );
    });

    it('should filter alerts by severity', async () => {
      const highAlerts = mockAlerts.filter((a) => a.severity === 'high');
      mockCivilianService.getAllAlerts.mockResolvedValue(highAlerts);

      const result = await controller.getAllAlerts('high');

      expect(mockCivilianService.getAllAlerts).toHaveBeenCalledWith('high', 50);
    });

    it('should respect limit parameter', async () => {
      mockCivilianService.getAllAlerts.mockResolvedValue([mockAlerts[0]]);

      const result = await controller.getAllAlerts(undefined, '1');

      expect(mockCivilianService.getAllAlerts).toHaveBeenCalledWith(
        undefined,
        1,
      );
    });

    it('should return empty array when no alerts exist', async () => {
      mockCivilianService.getAllAlerts.mockResolvedValue([]);

      const result = await controller.getAllAlerts();

      expect(result).toEqual([]);
    });

    it('should handle service error', async () => {
      mockCivilianService.getAllAlerts.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.getAllAlerts()).rejects.toThrow('Database error');
    });
  });

  describe('GET /civilian/alerts/recent', () => {
    it('should return recent alerts with default limit', async () => {
      mockCivilianService.getRecentAlerts.mockResolvedValue(
        mockAlerts.slice(0, 3),
      );

      const result = await controller.getRecentAlerts();

      expect(mockCivilianService.getRecentAlerts).toHaveBeenCalledWith(3);
    });

    it('should return recent alerts with custom limit', async () => {
      mockCivilianService.getRecentAlerts.mockResolvedValue([mockAlerts[0]]);

      const result = await controller.getRecentAlerts('1');

      expect(mockCivilianService.getRecentAlerts).toHaveBeenCalledWith(1);
    });

    it('should return empty array when no recent alerts', async () => {
      mockCivilianService.getRecentAlerts.mockResolvedValue([]);

      const result = await controller.getRecentAlerts();

      expect(result).toEqual([]);
    });
  });

  // ==================== SHELTERS TESTS ====================

  describe('GET /civilian/shelters', () => {
    it('should return all shelters successfully', async () => {
      mockCivilianService.getAllShelters.mockResolvedValue(mockShelters);

      const result = await controller.getAllShelters();

      expect(result).toEqual(mockShelters);
      expect(mockCivilianService.getAllShelters).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
    });

    it('should filter shelters by status', async () => {
      const activeShelters = mockShelters.filter((s) => s.status === 'active');
      mockCivilianService.getAllShelters.mockResolvedValue(activeShelters);

      const result = await controller.getAllShelters('active');

      expect(mockCivilianService.getAllShelters).toHaveBeenCalledWith(
        'active',
        undefined,
      );
    });

    it('should filter shelters by district', async () => {
      mockCivilianService.getAllShelters.mockResolvedValue(mockShelters);

      const result = await controller.getAllShelters(undefined, '1');

      expect(mockCivilianService.getAllShelters).toHaveBeenCalledWith(
        undefined,
        1,
      );
    });

    it('should filter by both status and district', async () => {
      mockCivilianService.getAllShelters.mockResolvedValue([mockShelters[0]]);

      const result = await controller.getAllShelters('active', '1');

      expect(mockCivilianService.getAllShelters).toHaveBeenCalledWith(
        'active',
        1,
      );
    });

    it('should return empty array when no shelters match', async () => {
      mockCivilianService.getAllShelters.mockResolvedValue([]);

      const result = await controller.getAllShelters('inactive');

      expect(result).toEqual([]);
    });
  });

  // ==================== SOS TESTS ====================

  describe('POST /civilian/sos', () => {
    it('should create SOS request successfully', async () => {
      const dto = createValidSosDto();
      const createdSos = { id: 'SOS-NEW-001', ...dto, status: 'pending' };
      mockCivilianService.createSos.mockResolvedValue(createdSos);

      const result = await controller.createSos(dto);

      expect(result).toEqual(createdSos);
      expect(mockCivilianService.createSos).toHaveBeenCalledWith(dto);
    });

    it('should create SOS with all emergency types', async () => {
      const emergencyTypes = [
        'medical',
        'fire',
        'flood',
        'accident',
        'security',
        'other',
      ];

      for (const emergencyType of emergencyTypes) {
        const dto = { ...createValidSosDto(), emergencyType };
        mockCivilianService.createSos.mockResolvedValue({
          id: 'SOS-001',
          ...dto,
        });

        const result = await controller.createSos(dto);

        expect(result.emergencyType).toBe(emergencyType);
      }
    });

    it('should create SOS with minimum people count', async () => {
      const dto = { ...createValidSosDto(), peopleCount: 1 };
      mockCivilianService.createSos.mockResolvedValue({
        id: 'SOS-001',
        ...dto,
      });

      const result = await controller.createSos(dto);

      expect(result.peopleCount).toBe(1);
    });

    it('should create SOS with large people count', async () => {
      const dto = { ...createValidSosDto(), peopleCount: 100 };
      mockCivilianService.createSos.mockResolvedValue({
        id: 'SOS-001',
        ...dto,
      });

      const result = await controller.createSos(dto);

      expect(result.peopleCount).toBe(100);
    });

    it('should handle service error on SOS creation', async () => {
      const dto = createValidSosDto();
      mockCivilianService.createSos.mockRejectedValue(
        new Error('Failed to create SOS'),
      );

      await expect(controller.createSos(dto)).rejects.toThrow(
        'Failed to create SOS',
      );
    });

    it('should create SOS with valid coordinates', async () => {
      const dto = {
        ...createValidSosDto(),
        locationLat: 24.8607,
        locationLng: 67.0011, // Karachi coordinates
      };
      mockCivilianService.createSos.mockResolvedValue({
        id: 'SOS-001',
        ...dto,
      });

      const result = await controller.createSos(dto);

      expect(result.locationLat).toBe(24.8607);
      expect(result.locationLng).toBe(67.0011);
    });
  });

  // ==================== TRACKING TESTS ====================

  describe('GET /civilian/track/:id', () => {
    it('should track request by ID successfully', async () => {
      mockCivilianService.trackRequestById.mockResolvedValue(
        mockSosRequests[0],
      );

      const result = await controller.trackById('SOS-001');

      expect(result).toEqual(mockSosRequests[0]);
      expect(mockCivilianService.trackRequestById).toHaveBeenCalledWith(
        'SOS-001',
      );
    });

    it('should return null for non-existent ID', async () => {
      mockCivilianService.trackRequestById.mockResolvedValue(null);

      const result = await controller.trackById('INVALID-ID');

      expect(result).toBeNull();
    });

    it('should handle various ID formats', async () => {
      const ids = ['SOS-001', 'SOS-12345', 'sos-abc-123'];

      for (const id of ids) {
        mockCivilianService.trackRequestById.mockResolvedValue({
          id,
          status: 'pending',
        });

        const result = await controller.trackById(id);

        expect(mockCivilianService.trackRequestById).toHaveBeenCalledWith(id);
      }
    });
  });

  describe('GET /civilian/track?cnic=', () => {
    it('should track requests by CNIC successfully', async () => {
      mockCivilianService.trackRequestsByCnic.mockResolvedValue(
        mockSosRequests,
      );

      const result = await controller.trackByCnic('1234567890123');

      expect(result).toEqual(mockSosRequests);
      expect(mockCivilianService.trackRequestsByCnic).toHaveBeenCalledWith(
        '1234567890123',
      );
    });

    it('should return empty array for CNIC with no requests', async () => {
      mockCivilianService.trackRequestsByCnic.mockResolvedValue([]);

      const result = await controller.trackByCnic('9999999999999');

      expect(result).toEqual([]);
    });

    it('should return multiple requests for same CNIC', async () => {
      const multipleRequests = [
        { ...mockSosRequests[0], id: 'SOS-001' },
        { ...mockSosRequests[0], id: 'SOS-002' },
      ];
      mockCivilianService.trackRequestsByCnic.mockResolvedValue(
        multipleRequests,
      );

      const result = await controller.trackByCnic('1234567890123');

      expect(result.length).toBe(2);
    });
  });

  // ==================== MISSING PERSONS TESTS ====================

  describe('GET /civilian/missing-persons', () => {
    it('should return all missing persons', async () => {
      mockCivilianService.getAllMissingPersons.mockResolvedValue(
        mockMissingPersons,
      );

      const result = await controller.getAllMissingPersons();

      expect(result).toEqual(mockMissingPersons);
    });

    it('should filter by status', async () => {
      mockCivilianService.getAllMissingPersons.mockResolvedValue(
        mockMissingPersons,
      );

      await controller.getAllMissingPersons('missing');

      expect(mockCivilianService.getAllMissingPersons).toHaveBeenCalledWith(
        'missing',
        undefined,
        undefined,
      );
    });

    it('should filter by gender', async () => {
      mockCivilianService.getAllMissingPersons.mockResolvedValue(
        mockMissingPersons,
      );

      await controller.getAllMissingPersons(undefined, 'female');

      expect(mockCivilianService.getAllMissingPersons).toHaveBeenCalledWith(
        undefined,
        'female',
        undefined,
      );
    });

    it('should filter by age range', async () => {
      mockCivilianService.getAllMissingPersons.mockResolvedValue(
        mockMissingPersons,
      );

      await controller.getAllMissingPersons(undefined, undefined, '18-40');

      expect(mockCivilianService.getAllMissingPersons).toHaveBeenCalledWith(
        undefined,
        undefined,
        '18-40',
      );
    });

    it('should apply all filters together', async () => {
      mockCivilianService.getAllMissingPersons.mockResolvedValue([]);

      await controller.getAllMissingPersons('found', 'male', '0-18');

      expect(mockCivilianService.getAllMissingPersons).toHaveBeenCalledWith(
        'found',
        'male',
        '0-18',
      );
    });
  });

  describe('POST /civilian/missing-persons', () => {
    it('should create missing person report successfully', async () => {
      const dto = createValidMissingPersonDto();
      const created = { id: 1, ...dto, status: 'missing' };
      mockCivilianService.createMissingPersonReport.mockResolvedValue(created);

      const result = await controller.reportMissingPerson(dto);

      expect(result.id).toBe(1);
      expect(result.status).toBe('missing');
    });

    it('should create report with all genders', async () => {
      const genders = ['male', 'female', 'other'];

      for (const gender of genders) {
        const dto = { ...createValidMissingPersonDto(), gender };
        mockCivilianService.createMissingPersonReport.mockResolvedValue({
          id: 1,
          ...dto,
        });

        const result = await controller.reportMissingPerson(dto as any);

        expect(result.gender).toBe(gender);
      }
    });

    it('should create report with various ages', async () => {
      const ages = [0, 1, 18, 65, 100, 150];

      for (const age of ages) {
        const dto = { ...createValidMissingPersonDto(), age };
        mockCivilianService.createMissingPersonReport.mockResolvedValue({
          id: 1,
          ...dto,
        });

        const result = await controller.reportMissingPerson(dto as any);

        expect(result.age).toBe(age);
      }
    });

    it('should handle service error', async () => {
      const dto = createValidMissingPersonDto();
      mockCivilianService.createMissingPersonReport.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.reportMissingPerson(dto as any)).rejects.toThrow(
        'Database error',
      );
    });
  });

  // ==================== HELP TESTS ====================

  describe('GET /civilian/help', () => {
    it('should return help content', async () => {
      const helpContent = {
        emergencyNumbers: ['1122', '115'],
        guidelines: ['Stay calm', 'Call for help'],
        faqs: [{ q: 'What to do?', a: 'Stay safe' }],
      };
      mockCivilianService.getHelpContent.mockResolvedValue(helpContent);

      const result = await controller.getHelp();

      expect(result).toEqual(helpContent);
    });

    it('should return empty help when no content', async () => {
      mockCivilianService.getHelpContent.mockResolvedValue({});

      const result = await controller.getHelp();

      expect(result).toEqual({});
    });
  });

  // ==================== LOCATION DATA TESTS ====================

  describe('GET /civilian/provinces', () => {
    it('should return all provinces', async () => {
      mockCivilianService.getAllProvinces.mockResolvedValue(mockProvinces);

      const result = await controller.getAllProvinces();

      expect(result).toEqual(mockProvinces);
      expect(result.length).toBe(4);
    });

    it('should return empty array if no provinces', async () => {
      mockCivilianService.getAllProvinces.mockResolvedValue([]);

      const result = await controller.getAllProvinces();

      expect(result).toEqual([]);
    });
  });

  describe('GET /civilian/provinces/:provinceId/districts', () => {
    it('should return districts for province', async () => {
      mockCivilianService.getDistrictsByProvince.mockResolvedValue([
        mockDistricts[0],
      ]);

      const result = await controller.getDistrictsByProvince('1');

      expect(mockCivilianService.getDistrictsByProvince).toHaveBeenCalledWith(
        1,
      );
    });

    it('should parse province ID correctly', async () => {
      mockCivilianService.getDistrictsByProvince.mockResolvedValue([]);

      await controller.getDistrictsByProvince('42');

      expect(mockCivilianService.getDistrictsByProvince).toHaveBeenCalledWith(
        42,
      );
    });

    it('should return empty array for province with no districts', async () => {
      mockCivilianService.getDistrictsByProvince.mockResolvedValue([]);

      const result = await controller.getDistrictsByProvince('999');

      expect(result).toEqual([]);
    });
  });

  // ==================== EDGE CASES & ERROR HANDLING ====================

  describe('Edge Cases', () => {
    it('should handle large pagination values', async () => {
      mockCivilianService.getAllAlerts.mockResolvedValue([]);

      await controller.getAllAlerts(undefined, '10000');

      expect(mockCivilianService.getAllAlerts).toHaveBeenCalledWith(
        undefined,
        10000,
      );
    });

    it('should handle special characters in search', async () => {
      mockCivilianService.trackRequestById.mockResolvedValue(null);

      await controller.trackById('SOS-!@#$%');

      expect(mockCivilianService.trackRequestById).toHaveBeenCalledWith(
        'SOS-!@#$%',
      );
    });

    it('should handle empty string parameters', async () => {
      mockCivilianService.getAllAlerts.mockResolvedValue(mockAlerts);

      await controller.getAllAlerts('');

      expect(mockCivilianService.getAllAlerts).toHaveBeenCalledWith('', 50);
    });
  });
});
