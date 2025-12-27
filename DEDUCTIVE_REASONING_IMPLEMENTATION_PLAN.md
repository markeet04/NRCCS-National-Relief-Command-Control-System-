# AI-Powered Deductive Reasoning Implementation Plan
## Resource Allocation Suggestion System (NDMA → PDMA)

---

## 📋 Overview

**Objective**: Implement a rule-based deductive reasoning system that analyzes ML flood predictions and generates resource allocation suggestions from NDMA to PDMA, requiring human approval before execution.

**Scope**: NDMA → PDMA resource flow only (other levels remain unchanged)

**Key Principle**: AI suggests, humans decide

---

## 🎯 Rules to Implement

### Category 1: Auto-Allocation Rules
- **RULE-001**: High Flood Risk → Allocate Water
  - **Condition**: `flood_risk === 'High' AND confidence > 0.85 AND rainfall > 100mm`
  - **Action**: Suggest water allocation: `province_population * 10L`
  - **Priority**: 1 (Highest)

- **RULE-002**: High Flood Risk → Allocate Food
  - **Condition**: `flood_risk === 'High' AND confidence > 0.8`
  - **Action**: Suggest food allocation: `province_population * 3 meals * 7 days`
  - **Priority**: 2

- **RULE-003**: Moderate Risk + Heavy Rain → Allocate Medical
  - **Condition**: `flood_risk === 'Medium' AND rainfall > 80mm AND confidence > 0.75`
  - **Action**: Suggest medical supplies: `province_population * 0.05` (5% population coverage)
  - **Priority**: 3

- **RULE-004**: High Risk + Low Shelter Capacity → Allocate Shelter
  - **Condition**: `flood_risk === 'High' AND current_shelter_capacity < (province_population * 0.2)`
  - **Action**: Suggest shelter units: `province_population * 0.3 - current_capacity`
  - **Priority**: 4

### Category 2: Validation Rules
- **RULE-102**: Flag Low-Confidence Predictions
  - **Condition**: `confidence < 0.6`
  - **Action**: FLAG suggestion with "LOW_CONFIDENCE" warning
  - **Priority**: 98

- **RULE-103**: Validate Resource Availability
  - **Condition**: `requested_quantity > national_stock * 0.8`
  - **Action**: FLAG suggestion with "INSUFFICIENT_STOCK" warning, reduce quantity to `national_stock * 0.5`
  - **Priority**: 99

### Category 3: Optimization Rules
- **RULE-302**: Historical Flood Pattern Multiplier
  - **Condition**: `province has history of floods in last 3 years`
  - **Action**: MULTIPLY suggested quantity by 1.5x
  - **Priority**: 50

---

## 🏗️ Architecture Design

### 1. Database Schema Changes

#### New Table: `resource_suggestions`
```sql
CREATE TABLE resource_suggestions (
  id SERIAL PRIMARY KEY,
  suggestion_type VARCHAR(50) NOT NULL, -- 'WATER_ALLOCATION', 'FOOD_ALLOCATION', etc.
  province_id INTEGER NOT NULL REFERENCES provinces(id),
  resource_type VARCHAR(50) NOT NULL, -- 'food', 'water', 'medical', 'shelter'
  suggested_quantity INTEGER NOT NULL,
  reasoning TEXT NOT NULL, -- Human-readable explanation
  rule_ids VARCHAR[] NOT NULL, -- Array of rule IDs that triggered this ['RULE-001', 'RULE-302']
  confidence_score DECIMAL(3,2), -- From ML prediction
  ml_prediction_data JSONB, -- Full ML prediction: {flood_risk, rainfall, temp, humidity}
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  flags VARCHAR[], -- ['LOW_CONFIDENCE', 'INSUFFICIENT_STOCK']
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  reviewed_by INTEGER REFERENCES users(id),
  rejection_reason TEXT,
  execution_status VARCHAR(20), -- NULL, 'EXECUTING', 'COMPLETED', 'FAILED'
  allocation_id INTEGER REFERENCES ndma_resource_allocations(id) -- Link to actual allocation if approved
);

CREATE INDEX idx_suggestions_status ON resource_suggestions(status);
CREATE INDEX idx_suggestions_province ON resource_suggestions(province_id);
CREATE INDEX idx_suggestions_created ON resource_suggestions(created_at DESC);
```

#### Modify Existing Tables: Add historical flood tracking
```sql
-- Add to provinces table
ALTER TABLE provinces ADD COLUMN flood_history_count INTEGER DEFAULT 0;
ALTER TABLE provinces ADD COLUMN last_flood_date TIMESTAMP;
```

---

### 2. Backend Implementation

#### 2.1 Create New Module: `reasoning/`

**File Structure:**
```
backend/nrccs/src/reasoning/
├── reasoning.module.ts
├── reasoning.service.ts
├── reasoning.controller.ts
├── entities/
│   └── resource-suggestion.entity.ts
├── dtos/
│   ├── create-suggestion.dto.ts
│   ├── suggestion-response.dto.ts
│   └── review-suggestion.dto.ts
└── rules/
    ├── rule.interface.ts
    ├── rule-engine.ts
    ├── allocation-rules.ts
    ├── validation-rules.ts
    └── optimization-rules.ts
```

#### 2.2 Core Components

**A. Rule Interface** (`rules/rule.interface.ts`)
```typescript
export interface Rule {
  id: string; // 'RULE-001'
  name: string; // 'High Flood Risk Water Allocation'
  description: string;
  category: 'ALLOCATION' | 'VALIDATION' | 'OPTIMIZATION';
  priority: number; // Lower = higher priority
  condition: (facts: RuleFacts) => boolean;
  action: RuleAction;
}

export interface RuleFacts {
  floodRisk: 'Low' | 'Medium' | 'High';
  confidence: number;
  rainfall24h: number;
  rainfall48h: number;
  temperature: number;
  humidity: number;
  provinceId: number;
  provincePopulation: number; // Sum of all district populations
  currentResources: {
    food: number;
    water: number;
    medical: number;
    shelter: number;
  };
  nationalStock: {
    food: number;
    water: number;
    medical: number;
    shelter: number;
  };
  floodHistory: {
    count: number; // Floods in last 3 years
    lastFloodDate: Date | null;
  };
  simulationMode: boolean;
}

export interface RuleAction {
  type: 'SUGGEST_ALLOCATION' | 'FLAG' | 'MODIFY';
  resourceType?: 'food' | 'water' | 'medical' | 'shelter';
  quantityCalculator?: (facts: RuleFacts) => number;
  flag?: string; // 'LOW_CONFIDENCE', 'INSUFFICIENT_STOCK'
  multiplier?: number; // For optimization rules
}
```

**B. Rule Engine** (`rules/rule-engine.ts`)
```typescript
export class RuleEngine {
  private rules: Rule[] = [];

  registerRule(rule: Rule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  async evaluate(facts: RuleFacts): Promise<RuleEvaluationResult> {
    const matchedRules: Rule[] = [];
    const flags: string[] = [];
    const suggestions: SuggestionAction[] = [];
    let quantityModifiers: number[] = [];

    // Execute rules by priority
    for (const rule of this.rules) {
      if (rule.condition(facts)) {
        matchedRules.push(rule);

        switch (rule.action.type) {
          case 'SUGGEST_ALLOCATION':
            suggestions.push({
              ruleId: rule.id,
              resourceType: rule.action.resourceType,
              quantity: rule.action.quantityCalculator(facts),
            });
            break;
          case 'FLAG':
            flags.push(rule.action.flag);
            break;
          case 'MODIFY':
            quantityModifiers.push(rule.action.multiplier);
            break;
        }
      }
    }

    return {
      matchedRules: matchedRules.map(r => r.id),
      suggestions,
      flags,
      quantityModifiers,
    };
  }
}
```

**C. Reasoning Service** (`reasoning.service.ts`)
```typescript
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

  private initializeRules(): void {
    // Register all 7 rules
    this.ruleEngine.registerRule(RULE_001);
    this.ruleEngine.registerRule(RULE_002);
    this.ruleEngine.registerRule(RULE_003);
    this.ruleEngine.registerRule(RULE_004);
    this.ruleEngine.registerRule(RULE_102);
    this.ruleEngine.registerRule(RULE_103);
    this.ruleEngine.registerRule(RULE_302);
  }

  async processMLPrediction(
    prediction: FloodPredictionResponseDto,
    provinceId: number,
    userId: number,
  ): Promise<ResourceSuggestion[]> {
    // 1. Gather facts
    const facts = await this.gatherFacts(prediction, provinceId);

    // 2. Evaluate rules
    const evaluation = await this.ruleEngine.evaluate(facts);

    // 3. Create suggestions
    const suggestions: ResourceSuggestion[] = [];

    for (const suggestion of evaluation.suggestions) {
      let quantity = suggestion.quantity;

      // Apply modifiers (e.g., historical multiplier)
      for (const modifier of evaluation.quantityModifiers) {
        quantity *= modifier;
      }

      // Validate against stock
      const nationalStock = facts.nationalStock[suggestion.resourceType];
      if (quantity > nationalStock * 0.8) {
        quantity = Math.floor(nationalStock * 0.5);
        evaluation.flags.push('INSUFFICIENT_STOCK');
      }

      const suggestionEntity = this.suggestionRepo.create({
        suggestionType: `${suggestion.resourceType.toUpperCase()}_ALLOCATION`,
        provinceId,
        resourceType: suggestion.resourceType,
        suggestedQuantity: Math.floor(quantity),
        reasoning: this.generateReasoning(evaluation.matchedRules, facts, suggestion),
        ruleIds: evaluation.matchedRules,
        confidenceScore: prediction.confidence,
        mlPredictionData: prediction,
        flags: evaluation.flags,
        createdBy: userId,
        status: 'PENDING',
      });

      const saved = await this.suggestionRepo.save(suggestionEntity);
      suggestions.push(saved);
    }

    return suggestions;
  }

  private async gatherFacts(
    prediction: FloodPredictionResponseDto,
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

    // Get current province resources (PDMA level)
    const provinceResources = await this.resourceRepo.find({
      where: { provinceId, districtId: IsNull(), shelterId: IsNull() },
    });

    // Get national stock
    const nationalResources = await this.resourceRepo.find({
      where: { provinceId: IsNull(), districtId: IsNull(), shelterId: IsNull() },
    });

    return {
      floodRisk: prediction.flood_risk,
      confidence: prediction.confidence,
      rainfall24h: prediction.input_summary?.mapped_rain_mm || 0,
      rainfall48h: prediction.input_summary?.mapped_rain_mm * 1.5 || 0, // Estimate
      temperature: prediction.input_summary?.temperature || 25,
      humidity: prediction.input_summary?.humidity || 60,
      provinceId,
      provincePopulation,
      currentResources: this.aggregateResources(provinceResources),
      nationalStock: this.aggregateResources(nationalResources),
      floodHistory: {
        count: province.floodHistoryCount || 0,
        lastFloodDate: province.lastFloodDate,
      },
      simulationMode: prediction.simulationMode || false,
    };
  }

  async approveSuggestion(
    suggestionId: number,
    userId: number,
  ): Promise<NdmaResourceAllocation> {
    const suggestion = await this.suggestionRepo.findOne({
      where: { id: suggestionId, status: 'PENDING' },
    });

    if (!suggestion) {
      throw new NotFoundException('Suggestion not found or already processed');
    }

    // Update suggestion status
    suggestion.status = 'APPROVED';
    suggestion.reviewedBy = userId;
    suggestion.reviewedAt = new Date();
    suggestion.executionStatus = 'EXECUTING';
    await this.suggestionRepo.save(suggestion);

    try {
      // Execute allocation: NDMA → PDMA
      const allocation = await this.executeAllocation(suggestion);

      // Update suggestion with allocation link
      suggestion.executionStatus = 'COMPLETED';
      suggestion.allocationId = allocation.id;
      await this.suggestionRepo.save(suggestion);

      return allocation;
    } catch (error) {
      suggestion.executionStatus = 'FAILED';
      await this.suggestionRepo.save(suggestion);
      throw error;
    }
  }

  async rejectSuggestion(
    suggestionId: number,
    userId: number,
    reason: string,
  ): Promise<ResourceSuggestion> {
    const suggestion = await this.suggestionRepo.findOne({
      where: { id: suggestionId, status: 'PENDING' },
    });

    if (!suggestion) {
      throw new NotFoundException('Suggestion not found or already processed');
    }

    suggestion.status = 'REJECTED';
    suggestion.reviewedBy = userId;
    suggestion.reviewedAt = new Date();
    suggestion.rejectionReason = reason;

    return this.suggestionRepo.save(suggestion);
  }

  private async executeAllocation(
    suggestion: ResourceSuggestion,
  ): Promise<NdmaResourceAllocation> {
    // Call NDMA service to allocate resources
    // This uses the EXISTING allocation logic
    return this.ndmaService.allocateResourceToProvince({
      provinceId: suggestion.provinceId,
      resourceType: suggestion.resourceType,
      quantity: suggestion.suggestedQuantity,
      allocatedBy: suggestion.reviewedBy,
      notes: `AI-suggested allocation - ${suggestion.reasoning}`,
    });
  }
}
```

#### 2.3 API Endpoints

**Controller** (`reasoning.controller.ts`)
```typescript
@Controller('reasoning')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ReasoningController {
  constructor(private reasoningService: ReasoningService) {}

  @Post('suggestions/generate')
  @Roles('ndma')
  async generateSuggestions(
    @Body() dto: GenerateSuggestionsDto,
    @CurrentUser() user: User,
  ) {
    return this.reasoningService.processMLPrediction(
      dto.mlPrediction,
      dto.provinceId,
      user.id,
    );
  }

  @Get('suggestions')
  @Roles('ndma')
  async getPendingSuggestions(
    @Query('status') status: string = 'PENDING',
  ) {
    return this.reasoningService.getSuggestions({ status });
  }

  @Post('suggestions/:id/approve')
  @Roles('ndma')
  async approveSuggestion(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ) {
    return this.reasoningService.approveSuggestion(id, user.id);
  }

  @Post('suggestions/:id/reject')
  @Roles('ndma')
  async rejectSuggestion(
    @Param('id') id: number,
    @Body() dto: RejectSuggestionDto,
    @CurrentUser() user: User,
  ) {
    return this.reasoningService.rejectSuggestion(id, user.id, dto.reason);
  }
}
```

---

### 3. Integration with ML Flow

#### Modify NDMA Service to Auto-Generate Suggestions

**In `ndma.service.ts`:**
```typescript
async createAlertFromPrediction(prediction: FloodPredictionResponseDto, provinceId: number) {
  // ... existing alert creation logic ...

  // NEW: Auto-generate resource allocation suggestions
  if (!prediction.simulationMode && (prediction.flood_risk === 'High' || prediction.flood_risk === 'Medium')) {
    await this.reasoningService.processMLPrediction(prediction, provinceId, systemUserId);
  }
}
```

---

### 4. Frontend Implementation

#### 4.1 New Component: `SuggestionsTab`

**File**: `frontend/src/features/ndma/components/SuggestionsTab.jsx`

**Features:**
- Display pending suggestions in a table
- Show rule IDs, reasoning, confidence score, flags
- Approve/Reject buttons with confirmation modal
- Real-time updates when new suggestions arrive
- Filters: All / Pending / Approved / Rejected

**UI Mockup:**
```
╔════════════════════════════════════════════════════════════════╗
║  AI Resource Allocation Suggestions                            ║
╠════════════════════════════════════════════════════════════════╣
║  Filter: [Pending ▼]  Province: [All ▼]  Resource: [All ▼]   ║
╠════════════════════════════════════════════════════════════════╣
║ ID │ Province │ Resource │ Qty    │ Confidence │ Reasoning     ║
║────┼──────────┼──────────┼────────┼────────────┼───────────────║
║ 45 │ Punjab   │ Water    │ 50,000L│ 0.92 ⚠️   │ High flood    ║
║    │          │          │        │ RULE-001   │ risk detected ║
║    │          │          │        │ RULE-302   │ (1.5x hist.)  ║
║    │ [Approve] [Reject]                                        ║
║────┼──────────┼──────────┼────────┼────────────┼───────────────║
║ 44 │ Sindh    │ Food     │ 30,000 │ 0.85       │ Moderate risk ║
║    │          │ Kits     │ meals  │ RULE-002   │ Heavy rainfall║
║    │ [Approve] [Reject]                                        ║
╚════════════════════════════════════════════════════════════════╝
```

#### 4.2 Integration into NDMA Dashboard

Add new tab alongside existing tabs:
```jsx
<Tabs>
  <Tab label="Dashboard" />
  <Tab label="Resources" />
  <Tab label="AI Suggestions" /> {/* NEW */}
  <Tab label="Alerts" />
</Tabs>
```

---

## 🔄 Complete Workflow

### Step-by-Step Flow:

1. **ML Prediction Triggered** (Live or Simulation)
   - User runs flood prediction from NDMA dashboard
   - `FloodPredictionService.predict()` executes Python ML model
   - Returns: `{flood_risk: 'High', confidence: 0.92, rainfall: 120mm}`

2. **Alert Generation** (Existing Logic)
   - `NdmaService.createAlertFromPrediction()` creates alert
   - Alert saved to database, shown in Alerts tab

3. **AI Suggestion Generation** (NEW)
   - `ReasoningService.processMLPrediction()` called automatically
   - Gathers facts (province population, current stock, etc.)
   - Rule engine evaluates all 7 rules
   - Creates 1-4 suggestions (one per resource type that matches rules)
   - Suggestions saved with status `PENDING`

4. **NDMA Reviews Suggestions** (NEW Frontend)
   - NDMA user opens "AI Suggestions" tab
   - Sees pending suggestions with reasoning
   - Clicks "Approve" on Water allocation suggestion

5. **Allocation Execution** (Existing Logic Reused)
   - `ReasoningService.approveSuggestion()` called
   - Calls `NdmaService.allocateResourceToProvince()`
   - Resources deducted from NDMA national stock
   - Resources added to PDMA province stock
   - `ndma_resource_allocations` table updated
   - Suggestion status → `APPROVED`, execution → `COMPLETED`

6. **PDMA Receives Resources** (Unchanged)
   - PDMA sees updated stock in their dashboard
   - Can now allocate to districts (existing flow)

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  ML Prediction  │ (flood_risk: High, confidence: 0.92)
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────────┐
│  Alert System   │  │ Reasoning Engine │
│   (Existing)    │  │      (NEW)       │
└─────────────────┘  └────────┬─────────┘
                              │
                              │ Evaluates 7 Rules
                              │
                              ▼
                     ┌─────────────────────┐
                     │  Suggestion Created │
                     │   Status: PENDING   │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │  NDMA Reviews (UI)  │
                     │  [Approve] [Reject] │
                     └──────────┬──────────┘
                                │
                   ┌────────────┴──────────────┐
                   │                           │
                   ▼                           ▼
          ┌────────────────┐         ┌─────────────────┐
          │ Execute Alloc. │         │ Reject & Log    │
          │ NDMA → PDMA    │         │ (No Allocation) │
          └────────────────┘         └─────────────────┘
```

---

## 🛡️ Safety Mechanisms

### 1. Simulation Mode Protection
- **Rule**: Block all suggestions if `simulationMode === true`
- **Implementation**: Early return in `processMLPrediction()`

### 2. Stock Validation
- **Rule-103**: If suggested quantity > 80% national stock → Reduce to 50% and flag
- **Prevents**: Depleting entire national reserves

### 3. Human-in-the-Loop
- **All suggestions require manual approval**
- **No automatic allocations** (unlike full AI automation)

### 4. Audit Trail
- Every suggestion logs: rule IDs, reasoning, approval/rejection, timestamp
- Full traceability for compliance

---

## 📈 Implementation Phases

### **Phase 1: Database & Backend Core** (Day 1-2)
- ✅ Create `resource_suggestions` table
- ✅ Create `ResourceSuggestion` entity
- ✅ Implement `RuleEngine` class
- ✅ Define all 7 rules

### **Phase 2: Reasoning Service** (Day 3-4)
- ✅ Implement `ReasoningService`
- ✅ Build facts gathering logic (province population calculation)
- ✅ Integrate with ML prediction flow
- ✅ Create approval/rejection logic

### **Phase 3: API Layer** (Day 5)
- ✅ Create `ReasoningController`
- ✅ Define DTOs
- ✅ Add API endpoints
- ✅ Test with Postman/Thunder Client

### **Phase 4: Frontend UI** (Day 6-7)
- ✅ Create `SuggestionsTab` component
- ✅ Integrate with NDMA dashboard
- ✅ Add approve/reject modals
- ✅ Real-time updates

### **Phase 5: Testing & Refinement** (Day 8)
- ✅ End-to-end testing
- ✅ Edge case handling
- ✅ UI/UX polish
- ✅ Documentation

---

## 🧪 Testing Strategy

### Unit Tests
- Rule engine evaluation logic
- Facts gathering (population calculation)
- Quantity calculations

### Integration Tests
- ML prediction → Suggestion generation
- Approval → Allocation execution
- Rejection → No allocation

### E2E Tests
- Complete workflow: Prediction → Review → Allocation
- Verify PDMA receives resources

---

## 📝 Key Implementation Details

### Province Population Calculation
```typescript
async getProvincePopulation(provinceId: number): Promise<number> {
  const districts = await this.districtRepo.find({
    where: { provinceId },
  });
  return districts.reduce((sum, district) => sum + district.population, 0);
}
```

### Reasoning Format
```
"High flood risk detected (92% confidence) in Punjab with 120mm rainfall.
Historical flood pattern multiplier applied (1.5x).
Recommended water allocation: 50,000 liters for estimated population of 5,000.
Rules: RULE-001, RULE-302"
```

---

## ✅ Success Criteria

1. ✅ ML prediction with High risk → Auto-generates 2-4 suggestions
2. ✅ NDMA can approve/reject suggestions from UI
3. ✅ Approved suggestion → Resources move from NDMA to PDMA
4. ✅ Rejected suggestion → No allocation, logged for audit
5. ✅ Simulation mode predictions → No suggestions generated
6. ✅ Low stock → Suggestions flagged and quantities reduced
7. ✅ All 7 rules working correctly

---

## 🚫 What Remains Unchanged

- ✅ Current NDMA → Province allocation logic (reused)
- ✅ Current PDMA → District allocation logic
- ✅ Current request/approval workflows
- ✅ Alert generation system
- ✅ Resource tracking tables

**Only Addition**: AI suggestion layer between ML prediction and NDMA allocation decision

---

## 🎯 Final Architecture

```
NDMA Dashboard
    │
    ├─── Existing: Manual Allocation → allocateResourceToProvince()
    │
    └─── NEW: AI Suggestions Tab
              │
              ├─── Auto-generated from ML predictions
              ├─── Human review required
              └─── Approval triggers → allocateResourceToProvince()
                                         (Same existing logic)
```

---

## 📋 Approval Checklist

Please review and approve:

- [ ] Database schema (resource_suggestions table)
- [ ] 7 rules implementation (RULE-001, 002, 003, 004, 102, 103, 302)
- [ ] Workflow: AI suggests → NDMA approves → Allocation executes
- [ ] NDMA → PDMA flow only (other levels unchanged)
- [ ] Province population = Sum of district populations
- [ ] Existing allocation logic reused (no duplication)
- [ ] Simulation mode blocked from generating suggestions
- [ ] Frontend: AI Suggestions tab in NDMA dashboard

---

**Ready to proceed?** Reply "APPROVED" and I'll start implementation phase-by-phase.
