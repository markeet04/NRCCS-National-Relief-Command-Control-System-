import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ResourceSuggestion, SuggestionStatus, ExecutionStatus } from './entities/resource-suggestion.entity';
import { District } from '../common/entities/district.entity';
import { Province } from '../common/entities/province.entity';
import { Resource } from '../common/entities/resource.entity';
import { RuleEngine } from './rules/rule-engine';
import { ALL_RULES } from './rules/allocation-rules';
import { RuleFacts, ResourceStock, SuggestionAction } from './rules/rule.interface';
import { SuggestionResponseDto } from './dtos/suggestion-response.dto';

@Injectable()
export class ReasoningService {
  constructor(
    @InjectRepository(ResourceSuggestion)
    private suggestionRepo: Repository<ResourceSuggestion>,
    @InjectRepository(District)
    private districtRepo: Repository<District>,
    @InjectRepository(Province)
    private provinceRepo: Repository<Province>,
    @InjectRepository(Resource)
    private resourceRepo: Repository<Resource>,
    private ruleEngine: RuleEngine,
  ) {
    this.initializeRules();
  }

  // Lazy injection for NDMA service to avoid circular dependency
  private ndmaService: any;

  @Inject(forwardRef(() => require('../ndma/ndma.service').NdmaService))
  setNdmaService(service: any) {
    this.ndmaService = service;
  }

  private initializeRules(): void {
    this.ruleEngine.registerRules(ALL_RULES);
  }

  async processMLPrediction(
    prediction: any,
    provinceId: number,
    userId: number,
  ): Promise<ResourceSuggestion[]> {
    // Allow suggestions for both simulation and real predictions to test the deductive reasoning system
    console.log(`[ReasoningService] Processing ML prediction - Risk: ${prediction.flood_risk}, Simulation: ${prediction.simulationMode}`);

    // Only process High and Medium risk
    if (prediction.flood_risk !== 'High' && prediction.flood_risk !== 'Medium') {
      console.log('[ReasoningService] Skipping suggestion generation for low risk');
      return [];
    }

    // 1. Gather facts
    console.log(`[ReasoningService] Gathering facts for province ${provinceId}...`);
    const facts = await this.gatherFacts(prediction, provinceId);
    console.log(`[ReasoningService] Facts gathered:`, {
      provinceId: facts.provinceId,
      provincePopulation: facts.provincePopulation,
      floodRisk: facts.floodRisk,
      confidence: facts.confidence,
      nationalStock: facts.nationalStock,
      currentResources: facts.currentResources,
    });

    // 2. Evaluate rules
    console.log(`[ReasoningService] Evaluating rules...`);
    const evaluation = await this.ruleEngine.evaluate(facts);
    console.log(`[ReasoningService] Rule evaluation complete:`, {
      matchedRules: evaluation.matchedRules,
      suggestionsCount: evaluation.suggestions.length,
      flags: evaluation.flags,
    });

    // 3. Create suggestions
    const suggestions: ResourceSuggestion[] = [];

    for (const suggestion of evaluation.suggestions) {
      let quantity = suggestion.quantity;

      // Apply modifiers (e.g., historical multiplier from RULE-302)
      for (const modifier of evaluation.quantityModifiers) {
        quantity *= modifier;
      }

      const nationalStock = facts.nationalStock[suggestion.resourceType];
      const flags = [...evaluation.flags];

      // If suggested quantity exceeds available stock, flag as insufficient but still create the suggestion
      let insufficient = false;
      if (quantity > nationalStock) {
        insufficient = true;
        if (!flags.includes('INSUFFICIENT_STOCK')) {
          flags.push('INSUFFICIENT_STOCK');
        }
      }
      // If quantity is zero or negative, skip (invalid suggestion)
      if (quantity <= 0) {
        console.log(`Skipping ${suggestion.resourceType} suggestion: invalid quantity`);
        continue;
      }

      const suggestionEntity = this.suggestionRepo.create({
        suggestionType: `${suggestion.resourceType.toUpperCase()}_ALLOCATION`,
        provinceId,
        resourceType: suggestion.resourceType,
        suggestedQuantity: Math.floor(quantity),
        reasoning: this.generateReasoning(evaluation.matchedRules, facts, suggestion, quantity),
        ruleIds: evaluation.matchedRules,
        confidenceScore: prediction.confidence,
        mlPredictionData: prediction,
        flags,
        createdBy: userId,
        status: SuggestionStatus.PENDING,
      });

      const saved = await this.suggestionRepo.save(suggestionEntity);
      suggestions.push(saved);
    }

    return suggestions;
  }

  private async gatherFacts(
    prediction: any,
    provinceId: number,
  ): Promise<RuleFacts> {
    // Calculate province population (sum of district populations)
    const districts = await this.districtRepo.find({
      where: { provinceId },
    });
    const provincePopulation = districts.reduce((sum, d) => sum + d.population, 0);

    // Get province flood history
    const province = await this.provinceRepo.findOne({
      where: { id: provinceId },
    });

    if (!province) {
      throw new NotFoundException(`Province ${provinceId} not found`);
    }

    // Get current province resources (PDMA level)
    const provinceResources = await this.resourceRepo.find({
      where: { 
        provinceId, 
        districtId: IsNull(), 
        shelterId: IsNull() 
      },
    });

    // Get national stock (NDMA level)
    const nationalResources = await this.resourceRepo.find({
      where: { 
        provinceId: IsNull(), 
        districtId: IsNull(), 
        shelterId: IsNull() 
      },
    });

    return {
      floodRisk: prediction.flood_risk,
      confidence: prediction.confidence,
      rainfall24h: prediction.input_summary?.mapped_rain_mm || 0,
      rainfall48h: (prediction.input_summary?.mapped_rain_mm || 0) * 1.5,
      temperature: prediction.input_summary?.temperature || 25,
      humidity: prediction.input_summary?.humidity || 60,
      provinceId,
      provincePopulation,
      currentResources: this.aggregateResources(provinceResources),
      nationalStock: this.aggregateResources(nationalResources),
      floodHistory: {
        count: province.floodHistoryCount || 0,
        lastFloodDate: province.lastFloodDate || null,
      },
      simulationMode: prediction.simulationMode || false,
    };
  }

  private aggregateResources(resources: Resource[]): ResourceStock {
    const stock: ResourceStock = {
      food: 0,
      water: 0,
      medical: 0,
      shelter: 0,
    };

    for (const resource of resources) {
      const type = resource.resourceType.toLowerCase();
      if (type in stock) {
        stock[type as keyof ResourceStock] += resource.quantity;
      }
    }

    return stock;
  }

  private generateReasoning(
    ruleIds: string[],
    facts: RuleFacts,
    suggestion: SuggestionAction,
    finalQuantity: number,
  ): string {
    const parts: string[] = [];

    // Main risk assessment
    parts.push(
      `${facts.floodRisk} flood risk detected (${(facts.confidence * 100).toFixed(1)}% confidence) in province.`,
    );

    // Weather conditions
    if (facts.rainfall24h > 100) {
      parts.push(`Heavy rainfall: ${facts.rainfall24h}mm in last 24 hours.`);
    } else if (facts.rainfall24h > 80) {
      parts.push(`Moderate rainfall: ${facts.rainfall24h}mm in last 24 hours.`);
    }

    // Population impact
    parts.push(
      `Estimated affected population: ${facts.provincePopulation.toLocaleString()} people.`,
    );

    // Historical context
    if (ruleIds.includes('RULE-302')) {
      parts.push(
        `Historical flood pattern detected (${facts.floodHistory.count} floods in last 3 years). Quantity increased by 1.5x.`,
      );
    }

    // Resource allocation
    parts.push(
      `Recommended ${suggestion.resourceType} allocation: ${finalQuantity.toLocaleString()} units.`,
    );

    // Rules applied
    parts.push(`Rules applied: ${ruleIds.join(', ')}`);

    return parts.join(' ');
  }

  async getSuggestions(filters?: {
    status?: SuggestionStatus;
    provinceId?: number;
    resourceType?: string;
  }): Promise<SuggestionResponseDto[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.provinceId) {
      where.provinceId = filters.provinceId;
    }
    if (filters?.resourceType) {
      where.resourceType = filters.resourceType;
    }

    const suggestions = await this.suggestionRepo.find({
      where,
      relations: ['province'],
      order: { createdAt: 'DESC' },
    });

    // Dynamically update INSUFFICIENT_STOCK flag based on current inventory
    for (const suggestion of suggestions) {
      // Only check for pending suggestions
      if (suggestion.status !== SuggestionStatus.PENDING) continue;
      // Get current national stock for this resource type
      const nationalResource = await this.resourceRepo.findOne({
        where: {
          type: suggestion.resourceType,
          provinceId: IsNull(),
          districtId: IsNull(),
        },
      });
      const available = nationalResource ? (nationalResource.quantity - (nationalResource.allocated || 0)) : 0;
      const hasInsufficient = suggestion.flags && suggestion.flags.includes('INSUFFICIENT_STOCK');
      if (suggestion.suggestedQuantity > available) {
        // Add flag if missing
        if (!hasInsufficient) {
          suggestion.flags = [...(suggestion.flags || []), 'INSUFFICIENT_STOCK'];
          await this.suggestionRepo.save(suggestion);
        }
      } else {
        // Remove flag if present
        if (hasInsufficient) {
          suggestion.flags = (suggestion.flags || []).filter(f => f !== 'INSUFFICIENT_STOCK');
          await this.suggestionRepo.save(suggestion);
        }
      }
    }

    return suggestions.map((s) => this.toResponseDto(s));
  }

  async getSuggestionById(id: number): Promise<SuggestionResponseDto> {
    const suggestion = await this.suggestionRepo.findOne({
      where: { id },
      relations: ['province', 'allocation'],
    });

    if (!suggestion) {
      throw new NotFoundException('Suggestion not found');
    }

    // Dynamically update INSUFFICIENT_STOCK flag for this suggestion
    if (suggestion.status === SuggestionStatus.PENDING) {
      const nationalResource = await this.resourceRepo.findOne({
        where: {
          type: suggestion.resourceType,
          provinceId: IsNull(),
          districtId: IsNull(),
        },
      });
      const available = nationalResource ? (nationalResource.quantity - (nationalResource.allocated || 0)) : 0;
      const hasInsufficient = suggestion.flags && suggestion.flags.includes('INSUFFICIENT_STOCK');
      if (suggestion.suggestedQuantity > available) {
        if (!hasInsufficient) {
          suggestion.flags = [...(suggestion.flags || []), 'INSUFFICIENT_STOCK'];
          await this.suggestionRepo.save(suggestion);
        }
      } else {
        if (hasInsufficient) {
          suggestion.flags = (suggestion.flags || []).filter(f => f !== 'INSUFFICIENT_STOCK');
          await this.suggestionRepo.save(suggestion);
        }
      }
    }

    return this.toResponseDto(suggestion);
  }

  async approveSuggestion(
    suggestionId: number,
    user: import('../common/entities/user.entity').User,
  ): Promise<any> {
    const suggestion = await this.suggestionRepo.findOne({
      where: { id: suggestionId, status: SuggestionStatus.PENDING },
      relations: ['province'],
    });

    if (!suggestion) {
      throw new NotFoundException('Suggestion not found or already processed');
    }

    // Update suggestion status
    suggestion.status = SuggestionStatus.APPROVED;
    suggestion.reviewedBy = user.id;
    suggestion.reviewedAt = new Date();
    suggestion.executionStatus = ExecutionStatus.EXECUTING;
    await this.suggestionRepo.save(suggestion);

    try {
      // Execute allocation: NDMA → PDMA
      const allocation = await this.executeAllocation(suggestion, user);

      // Update suggestion with allocation link
      suggestion.executionStatus = ExecutionStatus.COMPLETED;
      suggestion.allocationId = allocation.id;
      await this.suggestionRepo.save(suggestion);

      return {
        suggestion: this.toResponseDto(suggestion),
        allocation,
      };
    } catch (error) {
      suggestion.executionStatus = ExecutionStatus.FAILED;
      await this.suggestionRepo.save(suggestion);
      throw error;
    }
  }

  async rejectSuggestion(
    suggestionId: number,
    userId: number,
    reason: string,
  ): Promise<SuggestionResponseDto> {
    const suggestion = await this.suggestionRepo.findOne({
      where: { id: suggestionId, status: SuggestionStatus.PENDING },
      relations: ['province'],
    });

    if (!suggestion) {
      throw new NotFoundException('Suggestion not found or already processed');
    }

    suggestion.status = SuggestionStatus.REJECTED;
    suggestion.reviewedBy = userId;
    suggestion.reviewedAt = new Date();
    suggestion.rejectionReason = reason;

    const saved = await this.suggestionRepo.save(suggestion);
    return this.toResponseDto(saved);
  }

  private async executeAllocation(
    suggestion: ResourceSuggestion,
    user: import('../common/entities/user.entity').User,
  ): Promise<any> {
    if (!this.ndmaService) {
      throw new BadRequestException('NDMA service not available');
    }

    // Call NDMA service to allocate resources
    return this.ndmaService.allocateResourceByType({
      resourceType: suggestion.resourceType,
      quantity: suggestion.suggestedQuantity,
      fromLevel: 'national',
      toLevel: 'province',
      provinceId: suggestion.provinceId,
      notes: `AI-suggested allocation - ${suggestion.reasoning}`,
    }, user);
  }

  private toResponseDto(suggestion: ResourceSuggestion): SuggestionResponseDto {
    return {
      id: suggestion.id,
      suggestionType: suggestion.suggestionType,
      provinceId: suggestion.provinceId,
      provinceName: suggestion.province?.name,
      resourceType: suggestion.resourceType,
      suggestedQuantity: suggestion.suggestedQuantity,
      reasoning: suggestion.reasoning,
      ruleIds: suggestion.ruleIds,
      confidenceScore: suggestion.confidenceScore,
      mlPredictionData: suggestion.mlPredictionData,
      status: suggestion.status,
      flags: suggestion.flags || [],
      createdAt: suggestion.createdAt,
      reviewedAt: suggestion.reviewedAt,
      rejectionReason: suggestion.rejectionReason,
      executionStatus: suggestion.executionStatus,
      allocationId: suggestion.allocationId,
    };
  }

  async getStats(): Promise<any> {
    const [total, pending, approved, rejected] = await Promise.all([
      this.suggestionRepo.count(),
      this.suggestionRepo.count({ where: { status: SuggestionStatus.PENDING } }),
      this.suggestionRepo.count({ where: { status: SuggestionStatus.APPROVED } }),
      this.suggestionRepo.count({ where: { status: SuggestionStatus.REJECTED } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
    };
  }
}
