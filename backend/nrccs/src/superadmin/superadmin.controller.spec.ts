/**
 * Superadmin Controller Test Suite
 *
 * Tests for superadmin system administration endpoints:
 * - User management (CRUD)
 * - Audit logs
 * - Activity logs
 * - System statistics
 * - Location data management
 *
 * Coverage: Full user lifecycle, logging, system monitoring
 */

import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  mockSuperadmin,
  mockNdmaUser,
  mockPdmaUser,
  mockDistrictUser,
  mockProvinces,
  mockDistricts,
  mockAuditLogs,
  mockActivityLogs,
  createValidUserDto,
  createMockUser,
} from '../test-utils';
import { UserRole, UserLevel } from '../common/entities/user.entity';

describe('SuperadminController', () => {
  let controller: SuperadminController;
  let superadminService: jest.Mocked<SuperadminService>;

  const mockSuperadminService = {
    // Users
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    changeUserPassword: jest.fn(),
    deactivateUser: jest.fn(),
    activateUser: jest.fn(),
    hardDeleteUser: jest.fn(),
    restoreUser: jest.fn(),
    // Audit Logs
    getAuditLogs: jest.fn(),
    getAuditLogsByUser: jest.fn(),
    getAuditLogsByEntity: jest.fn(),
    // Activity Logs
    getActivityLogs: jest.fn(),
    // Stats
    getSystemStats: jest.fn(),
    // Locations
    getAllProvinces: jest.fn(),
    getDistrictsByProvince: jest.fn(),
    getAllDistricts: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperadminController],
      providers: [
        { provide: SuperadminService, useValue: mockSuperadminService },
      ],
    })
      .overrideGuard(SessionAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SuperadminController>(SuperadminController);
    superadminService = module.get(SuperadminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== USER MANAGEMENT TESTS ====================

  describe('GET /superadmin/users', () => {
    it('should return all active users', async () => {
      const users = [
        mockSuperadmin,
        mockNdmaUser,
        mockPdmaUser,
        mockDistrictUser,
      ];
      mockSuperadminService.getAllUsers.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(result).toEqual(users);
      expect(mockSuperadminService.getAllUsers).toHaveBeenCalledWith(false);
    });

    it('should include deleted users when requested', async () => {
      const users = [mockSuperadmin, { ...mockNdmaUser, isDeleted: true }];
      mockSuperadminService.getAllUsers.mockResolvedValue(users);

      const result = await controller.getAllUsers('true');

      expect(mockSuperadminService.getAllUsers).toHaveBeenCalledWith(true);
    });

    it('should return empty array when no users exist', async () => {
      mockSuperadminService.getAllUsers.mockResolvedValue([]);

      const result = await controller.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('GET /superadmin/users/:id', () => {
    it('should return user by ID', async () => {
      mockSuperadminService.getUserById.mockResolvedValue(mockNdmaUser);

      const result = await controller.getUserById(2);

      expect(result).toEqual(mockNdmaUser);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockSuperadminService.getUserById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.getUserById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('POST /superadmin/users', () => {
    it('should create new user successfully', async () => {
      const dto = createValidUserDto();
      const createdUser = { id: 10, ...dto, isActive: true };
      mockSuperadminService.createUser.mockResolvedValue(createdUser);

      const result = await controller.createUser(dto as any, mockSuperadmin);

      expect(result.id).toBe(10);
      expect(mockSuperadminService.createUser).toHaveBeenCalledWith(
        dto,
        mockSuperadmin.id,
      );
    });

    it('should create NDMA user', async () => {
      const dto = {
        ...createValidUserDto(),
        role: UserRole.NDMA,
        level: UserLevel.NATIONAL,
      };
      mockSuperadminService.createUser.mockResolvedValue({ id: 11, ...dto });

      const result = await controller.createUser(dto as any, mockSuperadmin);

      expect(result.role).toBe(UserRole.NDMA);
    });

    it('should create PDMA user with province', async () => {
      const dto = {
        ...createValidUserDto(),
        role: UserRole.PDMA,
        level: UserLevel.PROVINCIAL,
        provinceId: 1,
      };
      mockSuperadminService.createUser.mockResolvedValue({ id: 12, ...dto });

      const result = await controller.createUser(dto as any, mockSuperadmin);

      expect(result.role).toBe(UserRole.PDMA);
      expect(result.provinceId).toBe(1);
    });

    it('should create District user with district', async () => {
      const dto = {
        ...createValidUserDto(),
        role: UserRole.DISTRICT,
        level: UserLevel.DISTRICT,
        provinceId: 1,
        districtId: 1,
      };
      mockSuperadminService.createUser.mockResolvedValue({ id: 13, ...dto });

      const result = await controller.createUser(dto as any, mockSuperadmin);

      expect(result.role).toBe(UserRole.DISTRICT);
      expect(result.districtId).toBe(1);
    });

    it('should throw ConflictException for duplicate email', async () => {
      const dto = createValidUserDto();
      mockSuperadminService.createUser.mockRejectedValue(
        new ConflictException('Email already exists'),
      );

      await expect(
        controller.createUser(dto as any, mockSuperadmin),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('PUT /superadmin/users/:id', () => {
    it('should update user successfully', async () => {
      const dto = { name: 'Updated Name' };
      mockSuperadminService.updateUser.mockResolvedValue({
        ...mockNdmaUser,
        name: 'Updated Name',
      });

      const result = await controller.updateUser(2, dto as any, mockSuperadmin);

      expect(result.name).toBe('Updated Name');
    });

    it('should update user role', async () => {
      const dto = { role: UserRole.PDMA, provinceId: 1 };
      mockSuperadminService.updateUser.mockResolvedValue({
        ...mockNdmaUser,
        role: UserRole.PDMA,
        provinceId: 1,
      });

      const result = await controller.updateUser(2, dto as any, mockSuperadmin);

      expect(result.role).toBe(UserRole.PDMA);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockSuperadminService.updateUser.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.updateUser(999, { name: 'Test' } as any, mockSuperadmin),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('PUT /superadmin/users/:id/password', () => {
    it('should change user password', async () => {
      const dto = { newPassword: 'NewSecurePass123!' };
      mockSuperadminService.changeUserPassword.mockResolvedValue({
        message: 'Password changed successfully',
      });

      const result = await controller.changeUserPassword(
        2,
        dto as any,
        mockSuperadmin,
      );

      expect(result.message).toBe('Password changed successfully');
    });

    it('should handle weak password', async () => {
      const dto = { newPassword: '123' };
      mockSuperadminService.changeUserPassword.mockRejectedValue(
        new BadRequestException('Password too weak'),
      );

      await expect(
        controller.changeUserPassword(2, dto as any, mockSuperadmin),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('PUT /superadmin/users/:id/deactivate', () => {
    it('should deactivate user', async () => {
      mockSuperadminService.deactivateUser.mockResolvedValue({
        ...mockNdmaUser,
        isActive: false,
      });

      const result = await controller.deactivateUser(2, mockSuperadmin);

      expect(result.isActive).toBe(false);
    });

    it('should prevent self-deactivation', async () => {
      mockSuperadminService.deactivateUser.mockRejectedValue(
        new BadRequestException('Cannot deactivate yourself'),
      );

      await expect(
        controller.deactivateUser(1, mockSuperadmin),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('PUT /superadmin/users/:id/activate', () => {
    it('should activate user', async () => {
      mockSuperadminService.activateUser.mockResolvedValue({
        ...mockNdmaUser,
        isActive: true,
      });

      const result = await controller.activateUser(2, mockSuperadmin);

      expect(result.isActive).toBe(true);
    });
  });

  describe('DELETE /superadmin/users/:id', () => {
    it('should hard delete user', async () => {
      mockSuperadminService.hardDeleteUser.mockResolvedValue({ deleted: true });

      const result = await controller.hardDeleteUser(2, mockSuperadmin);

      expect(result.deleted).toBe(true);
    });

    it('should prevent self-deletion', async () => {
      mockSuperadminService.hardDeleteUser.mockRejectedValue(
        new BadRequestException('Cannot delete yourself'),
      );

      await expect(
        controller.hardDeleteUser(1, mockSuperadmin),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('PUT /superadmin/users/:id/restore', () => {
    it('should restore deleted user', async () => {
      mockSuperadminService.restoreUser.mockResolvedValue({
        ...mockNdmaUser,
        isDeleted: false,
      });

      const result = await controller.restoreUser(2, mockSuperadmin);

      expect(result.isDeleted).toBe(false);
    });

    it('should throw for non-deleted user', async () => {
      mockSuperadminService.restoreUser.mockRejectedValue(
        new BadRequestException('User is not deleted'),
      );

      await expect(controller.restoreUser(2, mockSuperadmin)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ==================== AUDIT LOGS TESTS ====================

  describe('GET /superadmin/audit-logs', () => {
    it('should return audit logs', async () => {
      mockSuperadminService.getAuditLogs.mockResolvedValue(mockAuditLogs);

      const result = await controller.getAuditLogs();

      expect(result).toEqual(mockAuditLogs);
      expect(mockSuperadminService.getAuditLogs).toHaveBeenCalledWith(100, 0);
    });

    it('should respect pagination parameters', async () => {
      mockSuperadminService.getAuditLogs.mockResolvedValue([mockAuditLogs[0]]);

      await controller.getAuditLogs('50', '10');

      expect(mockSuperadminService.getAuditLogs).toHaveBeenCalledWith(50, 10);
    });
  });

  describe('GET /superadmin/audit-logs/user/:userId', () => {
    it('should return audit logs for specific user', async () => {
      mockSuperadminService.getAuditLogsByUser.mockResolvedValue(mockAuditLogs);

      const result = await controller.getAuditLogsByUser(1);

      expect(result).toEqual(mockAuditLogs);
    });

    it('should respect limit parameter', async () => {
      mockSuperadminService.getAuditLogsByUser.mockResolvedValue([
        mockAuditLogs[0],
      ]);

      await controller.getAuditLogsByUser(1, '10');

      expect(mockSuperadminService.getAuditLogsByUser).toHaveBeenCalledWith(
        1,
        10,
      );
    });
  });

  describe('GET /superadmin/audit-logs/entity/:entityType/:entityId', () => {
    it('should return audit logs for specific entity', async () => {
      mockSuperadminService.getAuditLogsByEntity.mockResolvedValue(
        mockAuditLogs,
      );

      const result = await controller.getAuditLogsByEntity('user', '5');

      expect(mockSuperadminService.getAuditLogsByEntity).toHaveBeenCalledWith(
        'user',
        '5',
      );
    });

    it('should handle different entity types', async () => {
      const entityTypes = ['user', 'shelter', 'alert', 'resource'];

      for (const entityType of entityTypes) {
        mockSuperadminService.getAuditLogsByEntity.mockResolvedValue([]);

        await controller.getAuditLogsByEntity(entityType, '1');

        expect(mockSuperadminService.getAuditLogsByEntity).toHaveBeenCalledWith(
          entityType,
          '1',
        );
      }
    });
  });

  // ==================== ACTIVITY LOGS TESTS ====================

  describe('GET /superadmin/activity-logs', () => {
    it('should return activity logs', async () => {
      mockSuperadminService.getActivityLogs.mockResolvedValue(mockActivityLogs);

      const result = await controller.getActivityLogs();

      expect(result).toEqual(mockActivityLogs);
    });

    it('should respect pagination', async () => {
      mockSuperadminService.getActivityLogs.mockResolvedValue([
        mockActivityLogs[0],
      ]);

      await controller.getActivityLogs('25', '5');

      expect(mockSuperadminService.getActivityLogs).toHaveBeenCalledWith(25, 5);
    });
  });

  // ==================== SYSTEM STATS TESTS ====================

  describe('GET /superadmin/stats', () => {
    it('should return system statistics', async () => {
      const stats = {
        totalUsers: 100,
        activeUsers: 95,
        totalSosRequests: 5000,
        totalShelters: 500,
        totalResources: 200,
      };
      mockSuperadminService.getSystemStats.mockResolvedValue(stats);

      const result = await controller.getSystemStats();

      expect(result).toEqual(stats);
    });

    it('should handle stats retrieval error', async () => {
      mockSuperadminService.getSystemStats.mockRejectedValue(
        new Error('Stats calculation failed'),
      );

      await expect(controller.getSystemStats()).rejects.toThrow(
        'Stats calculation failed',
      );
    });
  });

  // ==================== LOCATION DATA TESTS ====================

  describe('GET /superadmin/provinces', () => {
    it('should return all provinces', async () => {
      mockSuperadminService.getAllProvinces.mockResolvedValue(mockProvinces);

      const result = await controller.getAllProvinces();

      expect(result).toEqual(mockProvinces);
    });
  });

  describe('GET /superadmin/provinces/:id/districts', () => {
    it('should return districts for province', async () => {
      mockSuperadminService.getDistrictsByProvince.mockResolvedValue([
        mockDistricts[0],
      ]);

      const result = await controller.getDistrictsByProvince(1);

      expect(mockSuperadminService.getDistrictsByProvince).toHaveBeenCalledWith(
        1,
      );
    });
  });

  describe('GET /superadmin/districts', () => {
    it('should return all districts', async () => {
      mockSuperadminService.getAllDistricts.mockResolvedValue(mockDistricts);

      const result = await controller.getAllDistricts();

      expect(result).toEqual(mockDistricts);
    });
  });

  // ==================== AUTHORIZATION TESTS ====================

  describe('Authorization', () => {
    it('should require SUPERADMIN role', () => {
      const roles = Reflect.getMetadata('roles', SuperadminController);
      expect(roles).toContain('superadmin');
    });

    it('should have guards on controller', () => {
      const guards = Reflect.getMetadata('__guards__', SuperadminController);
      expect(guards).toBeDefined();
    });
  });

  // ==================== HTTP STATUS CODES ====================

  describe('HTTP Status Codes', () => {
    it('should return 201 for user creation', () => {
      const httpCode = Reflect.getMetadata(
        '__httpCode__',
        SuperadminController.prototype.createUser,
      );
      expect(httpCode).toBe(201);
    });
  });
});
