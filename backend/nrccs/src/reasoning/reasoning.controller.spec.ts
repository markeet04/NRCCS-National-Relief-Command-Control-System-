/**
 * Reasoning Controller Test Suite
 * 
 * Tests for AI deductive reasoning engine endpoints:
 * - Resource suggestion generation
 * - Suggestion management
 * - Approval/Rejection workflow
 * 
 * Coverage: ML integration, suggestion lifecycle, NDMA-only access
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReasoningController } from './reasoning.controller';
import { ReasoningService } from './reasoning.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  mockNdmaUser,
  mockResourceSuggestions,
  mockFloodPrediction,
} from '../test-utils';

describe('ReasoningController', () => {
  let controller: ReasoningController;
  let reasoningService: jest.Mocked<ReasoningService>;

  const mockReasoningService = {
    processMLPrediction: jest.fn(),
    getSuggestions: jest.fn(),
    getStats: jest.fn(),
    getSuggestionById: jest.fn(),
    approveSuggestion: jest.fn(),
    rejectSuggestion: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReasoningController],
      providers: [
        { provide: ReasoningService, useValue: mockReasoningService },
      ],
    })
      .overrideGuard(SessionAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ReasoningController>(ReasoningController);
    reasoningService = module.get(ReasoningService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== SUGGESTION GENERATION TESTS ====================

  describe('POST /reasoning/suggestions/generate', () => {
    it('should generate suggestions from ML prediction', async () => {
      const dto = {
        mlPrediction: mockFloodPrediction,
        provinceId: 1,
      };
      mockReasoningService.processMLPrediction.mockResolvedValue(mockResourceSuggestions);

      const result = await controller.generateSuggestions(dto as any, mockNdmaUser as any);

      expect(result).toEqual(mockResourceSuggestions);
      expect(mockReasoningService.processMLPrediction).toHaveBeenCalledWith(
        dto.mlPrediction,
        dto.provinceId,
        mockNdmaUser.id,
      );
    });

    it('should generate suggestions for high-risk prediction', async () => {
      const dto = {
        mlPrediction: { flood_risk: 'High', confidence: 0.92 },
        provinceId: 1,
      };
      const highRiskSuggestions = mockResourceSuggestions.map((s) => ({
        ...s,
        suggestedQuantity: s.suggestedQuantity * 2,
        priority: 'critical',
      }));
      mockReasoningService.processMLPrediction.mockResolvedValue(highRiskSuggestions);

      const result = await controller.generateSuggestions(dto as any, mockNdmaUser as any);

      expect(result[0].priority).toBe('critical');
    });

    it('should handle different provinces', async () => {
      const provinces = [1, 2, 3, 4];

      for (const provinceId of provinces) {
        const dto = { mlPrediction: mockFloodPrediction, provinceId };
        mockReasoningService.processMLPrediction.mockResolvedValue(mockResourceSuggestions);

        await controller.generateSuggestions(dto as any, mockNdmaUser as any);

        expect(mockReasoningService.processMLPrediction).toHaveBeenCalledWith(
          mockFloodPrediction,
          provinceId,
          mockNdmaUser.id,
        );
      }
    });

    it('should handle ML service error', async () => {
      const dto = { mlPrediction: mockFloodPrediction, provinceId: 1 };
      mockReasoningService.processMLPrediction.mockRejectedValue(
        new Error('Reasoning engine unavailable'),
      );

      await expect(
        controller.generateSuggestions(dto as any, mockNdmaUser as any),
      ).rejects.toThrow('Reasoning engine unavailable');
    });

    it('should return empty array for low-risk prediction', async () => {
      const dto = {
        mlPrediction: { flood_risk: 'Low', confidence: 0.95 },
        provinceId: 1,
      };
      mockReasoningService.processMLPrediction.mockResolvedValue([]);

      const result = await controller.generateSuggestions(dto as any, mockNdmaUser as any);

      expect(result).toEqual([]);
    });
  });

  // ==================== GET SUGGESTIONS TESTS ====================

  describe('GET /reasoning/suggestions', () => {
    it('should return all suggestions', async () => {
      mockReasoningService.getSuggestions.mockResolvedValue(mockResourceSuggestions);

      const result = await controller.getSuggestions();

      expect(result).toEqual(mockResourceSuggestions);
    });

    it('should filter by status', async () => {
      const pendingSuggestions = mockResourceSuggestions.filter((s) => s.status === 'pending');
      mockReasoningService.getSuggestions.mockResolvedValue(pendingSuggestions);

      await controller.getSuggestions('pending' as any);

      expect(mockReasoningService.getSuggestions).toHaveBeenCalledWith({
        status: 'pending',
        provinceId: undefined,
        resourceType: undefined,
      });
    });

    it('should filter by province', async () => {
      mockReasoningService.getSuggestions.mockResolvedValue(mockResourceSuggestions);

      await controller.getSuggestions(undefined, 1);

      expect(mockReasoningService.getSuggestions).toHaveBeenCalledWith({
        status: undefined,
        provinceId: 1,
        resourceType: undefined,
      });
    });

    it('should filter by resource type', async () => {
      const foodSuggestions = mockResourceSuggestions.filter(
        (s) => s.resourceType === 'food_supplies',
      );
      mockReasoningService.getSuggestions.mockResolvedValue(foodSuggestions);

      await controller.getSuggestions(undefined, undefined, 'food_supplies');

      expect(mockReasoningService.getSuggestions).toHaveBeenCalledWith({
        status: undefined,
        provinceId: undefined,
        resourceType: 'food_supplies',
      });
    });

    it('should apply multiple filters', async () => {
      mockReasoningService.getSuggestions.mockResolvedValue([]);

      await controller.getSuggestions('approved' as any, 2, 'medical_supplies');

      expect(mockReasoningService.getSuggestions).toHaveBeenCalledWith({
        status: 'approved',
        provinceId: 2,
        resourceType: 'medical_supplies',
      });
    });

    it('should return empty array when no suggestions match', async () => {
      mockReasoningService.getSuggestions.mockResolvedValue([]);

      const result = await controller.getSuggestions('rejected' as any);

      expect(result).toEqual([]);
    });
  });

  // ==================== SUGGESTION STATS TESTS ====================

  describe('GET /reasoning/suggestions/stats', () => {
    it('should return suggestion statistics', async () => {
      const stats = {
        total: 100,
        pending: 30,
        approved: 50,
        rejected: 20,
        averageConfidence: 0.82,
        byResourceType: {
          food_supplies: 40,
          medical_supplies: 30,
          shelter_supplies: 30,
        },
      };
      mockReasoningService.getStats.mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(result).toEqual(stats);
    });

    it('should handle stats calculation error', async () => {
      mockReasoningService.getStats.mockRejectedValue(
        new Error('Stats calculation failed'),
      );

      await expect(controller.getStats()).rejects.toThrow('Stats calculation failed');
    });
  });

  // ==================== GET SUGGESTION BY ID TESTS ====================

  describe('GET /reasoning/suggestions/:id', () => {
    it('should return suggestion by ID', async () => {
      mockReasoningService.getSuggestionById.mockResolvedValue(mockResourceSuggestions[0]);

      const result = await controller.getSuggestionById(1);

      expect(result).toEqual(mockResourceSuggestions[0]);
    });

    it('should throw NotFoundException for non-existent suggestion', async () => {
      mockReasoningService.getSuggestionById.mockRejectedValue(
        new NotFoundException('Suggestion not found'),
      );

      await expect(controller.getSuggestionById(999)).rejects.toThrow(NotFoundException);
    });

    it('should return suggestion with detailed reasoning', async () => {
      const detailedSuggestion = {
        ...mockResourceSuggestions[0],
        reasoning: {
          factors: ['High flood risk', 'Limited current stock', 'Historical demand'],
          confidence_breakdown: { flood_risk: 0.4, stock_level: 0.3, demand: 0.3 },
        },
      };
      mockReasoningService.getSuggestionById.mockResolvedValue(detailedSuggestion);

      const result = await controller.getSuggestionById(1);

      expect(result.reasoning).toBeDefined();
      expect(result.reasoning.factors.length).toBeGreaterThan(0);
    });
  });

  // ==================== APPROVE SUGGESTION TESTS ====================

  describe('POST /reasoning/suggestions/:id/approve', () => {
    it('should approve suggestion', async () => {
      const approvedSuggestion = {
        ...mockResourceSuggestions[0],
        status: 'approved',
        approvedBy: mockNdmaUser.id,
        approvedAt: new Date(),
      };
      mockReasoningService.approveSuggestion.mockResolvedValue(approvedSuggestion);

      const result = await controller.approveSuggestion(1, mockNdmaUser as any);

      expect(result.status).toBe('approved');
      expect(result.approvedBy).toBe(mockNdmaUser.id);
    });

    it('should throw NotFoundException for non-existent suggestion', async () => {
      mockReasoningService.approveSuggestion.mockRejectedValue(
        new NotFoundException('Suggestion not found'),
      );

      await expect(controller.approveSuggestion(999, mockNdmaUser as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle already approved suggestion', async () => {
      mockReasoningService.approveSuggestion.mockRejectedValue(
        new BadRequestException('Suggestion already processed'),
      );

      await expect(controller.approveSuggestion(1, mockNdmaUser as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should trigger resource allocation on approval', async () => {
      const approvedWithAllocation = {
        ...mockResourceSuggestions[0],
        status: 'approved',
        allocationId: 123,
      };
      mockReasoningService.approveSuggestion.mockResolvedValue(approvedWithAllocation);

      const result = await controller.approveSuggestion(1, mockNdmaUser as any);

      expect(result.allocationId).toBe(123);
    });
  });

  // ==================== REJECT SUGGESTION TESTS ====================

  describe('POST /reasoning/suggestions/:id/reject', () => {
    it('should reject suggestion with reason', async () => {
      const dto = { reason: 'Resources not available' };
      const rejectedSuggestion = {
        ...mockResourceSuggestions[0],
        status: 'rejected',
        rejectionReason: dto.reason,
        rejectedBy: mockNdmaUser.id,
      };
      mockReasoningService.rejectSuggestion.mockResolvedValue(rejectedSuggestion);

      const result = await controller.rejectSuggestion(1, dto as any, mockNdmaUser as any);

      expect(result.status).toBe('rejected');
      expect(result.rejectionReason).toBe(dto.reason);
    });

    it('should throw NotFoundException for non-existent suggestion', async () => {
      mockReasoningService.rejectSuggestion.mockRejectedValue(
        new NotFoundException('Suggestion not found'),
      );

      await expect(
        controller.rejectSuggestion(999, { reason: 'Test' } as any, mockNdmaUser as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle various rejection reasons', async () => {
      const reasons = [
        'Budget constraints',
        'Resources already allocated',
        'Assessment inaccurate',
        'Lower priority',
      ];

      for (const reason of reasons) {
        const dto = { reason };
        mockReasoningService.rejectSuggestion.mockResolvedValue({
          ...mockResourceSuggestions[0],
          status: 'rejected',
          rejectionReason: reason,
        });

        const result = await controller.rejectSuggestion(1, dto as any, mockNdmaUser as any);

        expect(result.rejectionReason).toBe(reason);
      }
    });

    it('should handle already rejected suggestion', async () => {
      mockReasoningService.rejectSuggestion.mockRejectedValue(
        new BadRequestException('Suggestion already processed'),
      );

      await expect(
        controller.rejectSuggestion(1, { reason: 'Test' } as any, mockNdmaUser as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== AUTHORIZATION TESTS ====================

  describe('Authorization', () => {
    it('should have guards on controller', () => {
      const guards = Reflect.getMetadata('__guards__', ReasoningController);
      expect(guards).toBeDefined();
    });

    it('should require NDMA role for generate endpoint', () => {
      const roles = Reflect.getMetadata('roles', ReasoningController.prototype.generateSuggestions);
      expect(roles).toContain('ndma');
    });

    it('should require NDMA role for approval endpoint', () => {
      const roles = Reflect.getMetadata('roles', ReasoningController.prototype.approveSuggestion);
      expect(roles).toContain('ndma');
    });

    it('should require NDMA role for rejection endpoint', () => {
      const roles = Reflect.getMetadata('roles', ReasoningController.prototype.rejectSuggestion);
      expect(roles).toContain('ndma');
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle empty ML prediction', async () => {
      const dto = { mlPrediction: {}, provinceId: 1 };
      mockReasoningService.processMLPrediction.mockResolvedValue([]);

      const result = await controller.generateSuggestions(dto as any, mockNdmaUser as any);

      expect(result).toEqual([]);
    });

    it('should handle very high confidence predictions', async () => {
      const dto = {
        mlPrediction: { flood_risk: 'High', confidence: 0.99 },
        provinceId: 1,
      };
      mockReasoningService.processMLPrediction.mockResolvedValue([
        { ...mockResourceSuggestions[0], confidence: 0.99, priority: 'urgent' },
      ]);

      const result = await controller.generateSuggestions(dto as any, mockNdmaUser as any);

      expect(result[0].priority).toBe('urgent');
    });

    it('should handle suggestion with zero quantity', async () => {
      const zeroSuggestion = { ...mockResourceSuggestions[0], suggestedQuantity: 0 };
      mockReasoningService.getSuggestionById.mockResolvedValue(zeroSuggestion);

      const result = await controller.getSuggestionById(1);

      expect(result.suggestedQuantity).toBe(0);
    });
  });
});
