export interface Rule {
  id: string;
  name: string;
  description: string;
  category: 'ALLOCATION' | 'VALIDATION' | 'OPTIMIZATION';
  priority: number;
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
  provincePopulation: number;
  currentResources: ResourceStock;
  nationalStock: ResourceStock;
  floodHistory: FloodHistory;
  simulationMode: boolean;
}

export interface ResourceStock {
  food: number;
  water: number;
  medical: number;
  shelter: number;
}

export interface FloodHistory {
  count: number;
  lastFloodDate: Date | null;
}

export interface RuleAction {
  type: 'SUGGEST_ALLOCATION' | 'FLAG' | 'MODIFY';
  resourceType?: 'food' | 'water' | 'medical' | 'shelter';
  quantityCalculator?: (facts: RuleFacts) => number;
  flag?: string;
  multiplier?: number;
}

export interface SuggestionAction {
  ruleId: string;
  resourceType: 'food' | 'water' | 'medical' | 'shelter';
  quantity: number;
}

export interface RuleEvaluationResult {
  matchedRules: string[];
  suggestions: SuggestionAction[];
  flags: string[];
  quantityModifiers: number[];
}
