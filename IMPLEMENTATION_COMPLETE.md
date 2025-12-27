# 🚀 AI Deductive Reasoning System - Implementation Complete

## ✅ Implementation Summary

The AI-powered deductive reasoning system has been successfully implemented in your NRCCS project. This system provides intelligent resource allocation suggestions based on ML flood predictions, requiring human approval before execution.

---

## 📦 What Was Implemented

### 1. **Database Changes** ✅
**File:** [`database_migration_deductive_reasoning.sql`](database_migration_deductive_reasoning.sql)

**Execute this SQL in your Neon database:**
- Creates `resource_suggestions` table to store AI-generated suggestions
- Adds `flood_history_count` and `last_flood_date` columns to `provinces` table
- Creates indexes for optimized queries
- Includes stats view for quick analytics

**Action Required:** Run the SQL script in your Neon SQL editor

---

### 2. **Backend Implementation** ✅

#### New Module: `reasoning/`
**Location:** `backend/nrccs/src/reasoning/`

**Created Files:**
1. **`entities/resource-suggestion.entity.ts`** - Database entity for suggestions
2. **`rules/rule.interface.ts`** - TypeScript interfaces for rule system
3. **`rules/rule-engine.ts`** - Core rule evaluation engine
4. **`rules/allocation-rules.ts`** - All 7 rules implementation:
   - **RULE-001**: High flood risk → Water allocation (10L per person)
   - **RULE-002**: High flood risk → Food allocation (3 meals × 7 days)
   - **RULE-003**: Medium risk + heavy rain → Medical supplies (5% population)
   - **RULE-004**: High risk + low shelter → Shelter units allocation
   - **RULE-102**: Flag low-confidence predictions (< 60%)
   - **RULE-103**: Validate insufficient stock (> 80% national stock)
   - **RULE-302**: Historical flood multiplier (1.5x for provinces with flood history)

5. **`reasoning.service.ts`** - Main service with:
   - `processMLPrediction()` - Evaluates rules and creates suggestions
   - `gatherFacts()` - Collects province population (sum of district populations), stock, history
   - `approveSuggestion()` - Executes allocation NDMA → PDMA
   - `rejectSuggestion()` - Logs rejection with reason

6. **`reasoning.controller.ts`** - REST API endpoints:
   - `GET /reasoning/suggestions` - List suggestions (filterable by status/province/resource)
   - `GET /reasoning/suggestions/stats` - Get approval statistics
   - `POST /reasoning/suggestions/:id/approve` - Approve and execute allocation
   - `POST /reasoning/suggestions/:id/reject` - Reject with reason

7. **`reasoning.module.ts`** - NestJS module configuration

#### Modified Files:
- **`app.module.ts`** - Registered ReasoningModule
- **`ndma/ndma.module.ts`** - Added circular dependency resolution
- **`ndma/ndma.service.ts`** - Auto-generates suggestions after ML predictions
- **`common/entities/province.entity.ts`** - Added flood history fields

---

### 3. **Frontend Implementation** ✅

#### New Components:
**Location:** `frontend/src/features/ndma/`

1. **`services/reasoningApi.js`** - API client for reasoning endpoints
2. **`hooks/useSuggestions.js`** - React hook for suggestion management
3. **`components/SuggestionsTab/`**:
   - **`SuggestionsTab.jsx`** - Main tab component with filters
   - **`SuggestionCard.jsx`** - Individual suggestion card display
   - **`StatsCards.jsx`** - Statistics dashboard (pending/approved/rejected)
   - **`ApproveModal.jsx`** - Confirmation modal for approval
   - **`RejectModal.jsx`** - Rejection modal with reason input
4. **`pages/SuggestionsPage/SuggestionsPage.jsx`** - Full page wrapper

#### Modified Files:
- **`pages/NDMAPortalRoutes.jsx`** - Added `/ndma/suggestions` route
- **`shared/constants/dashboardConfig.js`** - Added "AI Suggestions" menu item

---

## 🔄 Complete Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│  1. ML Prediction (User triggers from Flood Map)                │
│     → Python model returns: {flood_risk: High, confidence: 0.92}│
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  2. Alert Generation (Existing - UNCHANGED)                      │
│     → CRITICAL/HIGH alert created for PDMA                       │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  3. AI Reasoning Engine (NEW)                                    │
│     → Gathers facts: province population (sum of districts),     │
│       current stock, national stock, flood history               │
│     → Evaluates 7 rules in priority order                        │
│     → Creates 1-4 suggestions (water, food, medical, shelter)    │
│     → Status: PENDING                                            │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  4. NDMA Reviews (NEW Frontend)                                  │
│     → Opens "AI Suggestions" tab                                 │
│     → Sees: Province, Resource Type, Quantity, Reasoning, Rules  │
│     → Can see flags: LOW_CONFIDENCE, INSUFFICIENT_STOCK          │
│     → Decision: APPROVE or REJECT                                │
└────────────────┬─────────────────────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
┌─────────────────┐  ┌─────────────────┐
│   5a. APPROVE   │  │   5b. REJECT    │
│                 │  │                 │
│ → Executes      │  │ → Logs reason   │
│   allocation    │  │ → No allocation │
│ → NDMA → PDMA   │  │ → Audit trail   │
│ → Updates stock │  │                 │
│ → Status:       │  │ → Status:       │
│   APPROVED      │  │   REJECTED      │
└─────────────────┘  └─────────────────┘
```

---

## 🎯 Key Features

### ✅ Intelligent Decision Making
- Analyzes ML predictions + weather data + population + stock levels
- Multi-rule evaluation (allocation + validation + optimization)
- Province population calculated from district populations (as per your requirement)

### ✅ Safety Mechanisms
- **Simulation mode blocking**: No suggestions from test predictions
- **Stock validation**: Prevents depleting > 80% of national reserves
- **Low-confidence flagging**: Warns when ML confidence < 60%
- **Human-in-the-loop**: Every suggestion requires manual approval

### ✅ Audit Trail
- Every suggestion logged with:
  - Rule IDs that triggered it
  - ML confidence score
  - Full reasoning explanation
  - Approval/rejection decision
  - Timestamp and user

### ✅ Separate from Existing Logic
- Manual allocations: UNCHANGED
- Request/approval workflows: UNCHANGED
- PDMA → District flow: UNCHANGED
- **Only addition**: AI suggestion layer between ML prediction and NDMA decision

---

## 📊 Database Schema

### `resource_suggestions` Table
```sql
| Column               | Type      | Description                                    |
|---------------------|-----------|------------------------------------------------|
| id                  | SERIAL    | Primary key                                    |
| suggestion_type     | VARCHAR   | WATER_ALLOCATION, FOOD_ALLOCATION, etc.        |
| province_id         | INTEGER   | Target province (FK to provinces)              |
| resource_type       | VARCHAR   | water, food, medical, shelter                  |
| suggested_quantity  | INTEGER   | AI-calculated quantity                         |
| reasoning           | TEXT      | Human-readable explanation                     |
| rule_ids            | TEXT[]    | Array of rule IDs ["RULE-001", "RULE-302"]     |
| confidence_score    | DECIMAL   | ML prediction confidence (0.000-1.000)         |
| ml_prediction_data  | JSONB     | Full ML prediction data                        |
| status              | VARCHAR   | PENDING, APPROVED, REJECTED                    |
| flags               | TEXT[]    | LOW_CONFIDENCE, INSUFFICIENT_STOCK, etc.       |
| created_at          | TIMESTAMP | When suggestion was generated                  |
| reviewed_at         | TIMESTAMP | When NDMA approved/rejected                    |
| reviewed_by         | INTEGER   | User who made decision                         |
| rejection_reason    | TEXT      | Reason for rejection (if rejected)             |
| execution_status    | VARCHAR   | EXECUTING, COMPLETED, FAILED                   |
| allocation_id       | INTEGER   | FK to ndma_resource_allocations (if approved)  |
```

---

## 🧪 Testing Checklist

### Backend Testing:
```bash
# Start backend
cd backend/nrccs
npm run start:dev

# Test endpoints (use Thunder Client or Postman)
GET  /reasoning/suggestions
GET  /reasoning/suggestions/stats
POST /reasoning/suggestions/:id/approve
POST /reasoning/suggestions/:id/reject
```

### Frontend Testing:
```bash
# Start frontend
cd frontend
npm run dev

# Navigate to:
http://localhost:5173/ndma/suggestions

# Test workflow:
1. Run ML prediction (Flood Map page)
2. Check AI Suggestions tab
3. Approve/Reject suggestions
4. Verify resources updated in PDMA dashboard
```

---

## 🔧 Configuration Options

### Adjust Rule Thresholds:
**File:** `backend/nrccs/src/reasoning/rules/allocation-rules.ts`

```typescript
// Example: Change water allocation from 10L to 15L per person
quantityCalculator: (facts) => {
  return Math.floor(facts.provincePopulation * 15 * 3); // 15L × 3 days
}

// Example: Lower confidence threshold for RULE-102
condition: (facts) => {
  return facts.confidence < 0.5; // Changed from 0.6
}
```

### Add New Rules:
```typescript
export const RULE_005: Rule = {
  id: 'RULE-005',
  name: 'Your Custom Rule',
  category: 'ALLOCATION',
  priority: 5,
  condition: (facts) => {
    return facts.floodRisk === 'High' && facts.humidity > 80;
  },
  action: {
    type: 'SUGGEST_ALLOCATION',
    resourceType: 'water',
    quantityCalculator: (facts) => facts.provincePopulation * 5,
  },
};

// Register in reasoning.service.ts:
this.ruleEngine.registerRule(RULE_005);
```

---

## 📖 API Documentation

### Get Suggestions
```http
GET /reasoning/suggestions?status=PENDING&provinceId=1
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "suggestionType": "WATER_ALLOCATION",
    "provinceId": 1,
    "provinceName": "Punjab",
    "resourceType": "water",
    "suggestedQuantity": 150000,
    "reasoning": "High flood risk detected (92.0% confidence) in Punjab with 120mm rainfall. Estimated affected population: 50,000 people. Recommended water allocation: 150,000 liters. Rules applied: RULE-001",
    "ruleIds": ["RULE-001"],
    "confidenceScore": 0.92,
    "status": "PENDING",
    "flags": [],
    "createdAt": "2025-12-27T10:30:00Z"
  }
]
```

### Approve Suggestion
```http
POST /reasoning/suggestions/1/approve
Authorization: Bearer <token>

Response:
{
  "suggestion": { ...updated suggestion... },
  "allocation": {
    "id": 45,
    "resourceType": "water",
    "quantity": 150000,
    "fromLevel": "national",
    "toLevel": "province",
    "provinceId": 1
  }
}
```

### Reject Suggestion
```http
POST /reasoning/suggestions/1/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Stock levels too low for this allocation. Will manually assess after next shipment."
}

Response:
{
  "id": 1,
  "status": "REJECTED",
  "rejectionReason": "Stock levels too low...",
  "reviewedAt": "2025-12-27T10:35:00Z"
}
```

---

## 🎨 UI Screenshots (Text Description)

### AI Suggestions Tab:
```
╔════════════════════════════════════════════════════════════════╗
║  AI Resource Allocation Suggestions                     [Refresh]║
║  Review and approve AI-generated resource allocation recommendations║
╠════════════════════════════════════════════════════════════════╣
║  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              ║
║  │  Total  │ │ Pending │ │Approved │ │Rejected │              ║
║  │    12   │ │    3    │ │    8    │ │    1    │              ║
║  └─────────┘ └─────────┘ └─────────┘ └─────────┘              ║
╠════════════════════════════════════════════════════════════════╣
║  Filter: [Pending ▼]  Resource: [All ▼]                       ║
╠════════════════════════════════════════════════════════════════╣
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ 💧 Punjab | WATER | 🕐 Pending Review                  │   ║
║  │                                                         │   ║
║  │ 150,000 liters                                         │   ║
║  │                                                         │   ║
║  │ High flood risk detected (92% confidence) with 120mm   │   ║
║  │ rainfall. Estimated population: 50,000. Rules: RULE-001│   ║
║  │                                                         │   ║
║  │ [✓ Approve]  [✗ Reject]                               │   ║
║  └────────────────────────────────────────────────────────┘   ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 🚀 Next Steps

1. **Run SQL Migration**: Execute [`database_migration_deductive_reasoning.sql`](database_migration_deductive_reasoning.sql) in Neon
2. **Restart Backend**: `cd backend/nrccs && npm run start:dev`
3. **Restart Frontend**: `cd frontend && npm run dev`
4. **Test Workflow**:
   - Navigate to NDMA → Flood Map
   - Run ML prediction for a province (High risk)
   - Check NDMA → AI Suggestions tab
   - Approve a suggestion
   - Verify PDMA received resources

---

## 🐛 Troubleshooting

### No suggestions appearing?
- Check if ML prediction returned High/Medium risk
- Verify simulation mode is OFF (simulations don't generate suggestions)
- Check browser console for API errors
- Verify backend logs: `[NDMA] Generated X AI suggestions for <province>`

### Approval fails?
- Check national stock has sufficient quantity
- Verify user has NDMA role
- Check backend logs for allocation errors

### Population shows 0?
- Ensure districts in the province have population values set
- Province population = SUM(district.population) for that province

---

## 📝 Files Created

### Backend (15 files):
```
backend/nrccs/src/
├── reasoning/
│   ├── reasoning.module.ts
│   ├── reasoning.service.ts
│   ├── reasoning.controller.ts
│   ├── entities/
│   │   └── resource-suggestion.entity.ts
│   ├── dtos/
│   │   ├── generate-suggestions.dto.ts
│   │   ├── review-suggestion.dto.ts
│   │   └── suggestion-response.dto.ts
│   └── rules/
│       ├── rule.interface.ts
│       ├── rule-engine.ts
│       └── allocation-rules.ts
```

### Frontend (10 files):
```
frontend/src/features/ndma/
├── services/
│   └── reasoningApi.js
├── hooks/
│   └── useSuggestions.js
├── components/SuggestionsTab/
│   ├── SuggestionsTab.jsx
│   ├── SuggestionCard.jsx
│   ├── StatsCards.jsx
│   ├── ApproveModal.jsx
│   └── RejectModal.jsx
└── pages/SuggestionsPage/
    ├── SuggestionsPage.jsx
    └── index.js
```

### Database:
```
database_migration_deductive_reasoning.sql
```

### Documentation:
```
DEDUCTIVE_REASONING_IMPLEMENTATION_PLAN.md
IMPLEMENTATION_COMPLETE.md (this file)
```

---

## ✅ Implementation Complete!

All 7 rules have been implemented with the exact workflow you requested:
- AI suggests → NDMA approves/rejects → Resources flow NDMA → PDMA
- Province population calculated from district populations
- Existing allocation logic reused (no duplication)
- Completely separate from manual allocation workflows

**System is ready for testing!** 🎉
