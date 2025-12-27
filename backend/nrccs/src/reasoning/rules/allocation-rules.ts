import { Rule } from './rule.interface';

// RULE-001: High Flood Risk → Allocate Water
export const RULE_001: Rule = {
  id: 'RULE-001',
  name: 'High Flood Risk Water Allocation',
  description: 'Allocate water when high flood risk is detected with high confidence and heavy rainfall',
  category: 'ALLOCATION',
  priority: 1,
  condition: (facts) => {
    return (
      (facts.floodRisk === 'High' || facts.floodRisk === 'Medium') &&
      facts.confidence > 0.85 &&
      facts.rainfall24h > 100
    );
  },
  action: {
    type: 'SUGGEST_ALLOCATION',
    resourceType: 'water',
    quantityCalculator: (facts) => {
      // 10 liters per person for 3 days
      return Math.floor(facts.provincePopulation * 10 * 3);
    },
  },
};

// RULE-002: High Flood Risk → Allocate Food
export const RULE_002: Rule = {
  id: 'RULE-002',
  name: 'High Flood Risk Food Allocation',
  description: 'Allocate food packages when high flood risk is detected',
  category: 'ALLOCATION',
  priority: 2,
  condition: (facts) => {
    return (
      (facts.floodRisk === 'High' || facts.floodRisk === 'Medium') &&
      facts.confidence > 0.8
    );
  },
  action: {
    type: 'SUGGEST_ALLOCATION',
    resourceType: 'food',
    quantityCalculator: (facts) => {
      // 3 meals per day for 7 days
      return Math.floor(facts.provincePopulation * 3 * 7);
    },
  },
};

// RULE-003: Moderate Risk + Heavy Rain → Allocate Medical
export const RULE_003: Rule = {
  id: 'RULE-003',
  name: 'Moderate Risk Medical Supplies',
  description: 'Allocate medical supplies for moderate risk with heavy rainfall',
  category: 'ALLOCATION',
  priority: 3,
  condition: (facts) => {
    return (
      (facts.floodRisk === 'High' || facts.floodRisk === 'Medium') &&
      facts.rainfall24h > 80 &&
      facts.confidence > 0.75
    );
  },
  action: {
    type: 'SUGGEST_ALLOCATION',
    resourceType: 'medical',
    quantityCalculator: (facts) => {
      // 5% of population needs medical supplies
      return Math.floor(facts.provincePopulation * 0.05);
    },
  },
};

// RULE-004: High Risk + Low Shelter Capacity → Allocate Shelter
export const RULE_004: Rule = {
  id: 'RULE-004',
  name: 'High Risk Shelter Allocation',
  description: 'Allocate emergency shelter when capacity is insufficient',
  category: 'ALLOCATION',
  priority: 4,
  condition: (facts) => {
    const currentCapacity = facts.currentResources.shelter;
    const requiredCapacity = facts.provincePopulation * 0.2;
    return (
      (facts.floodRisk === 'High' || facts.floodRisk === 'Medium') &&
      currentCapacity < requiredCapacity
    );
  },
  action: {
    type: 'SUGGEST_ALLOCATION',
    resourceType: 'shelter',
    quantityCalculator: (facts) => {
      const currentCapacity = facts.currentResources.shelter;
      const requiredCapacity = facts.provincePopulation * 0.3;
      const shortage = requiredCapacity - currentCapacity;
      return Math.max(0, Math.floor(shortage));
    },
  },
};

// RULE-102: Flag Low-Confidence Predictions
export const RULE_102: Rule = {
  id: 'RULE-102',
  name: 'Low Confidence Flag',
  description: 'Flag predictions with low confidence for manual review',
  category: 'VALIDATION',
  priority: 98,
  condition: (facts) => {
    return facts.confidence < 0.6;
  },
  action: {
    type: 'FLAG',
    flag: 'LOW_CONFIDENCE',
  },
};

// RULE-103: Validate Resource Availability
export const RULE_103: Rule = {
  id: 'RULE-103',
  name: 'Insufficient Stock Validation',
  description: 'Flag and reduce quantities when national stock is low',
  category: 'VALIDATION',
  priority: 99,
  condition: (facts) => {
    // This rule is checked per-resource in the service
    return true;
  },
  action: {
    type: 'FLAG',
    flag: 'INSUFFICIENT_STOCK',
  },
};

// RULE-302: Historical Flood Pattern Multiplier
export const RULE_302: Rule = {
  id: 'RULE-302',
  name: 'Historical Flood Multiplier',
  description: 'Increase allocation for areas with recent flood history',
  category: 'OPTIMIZATION',
  priority: 50,
  condition: (facts) => {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    
    return (
      facts.floodHistory.count > 0 &&
      facts.floodHistory.lastFloodDate !== null &&
      new Date(facts.floodHistory.lastFloodDate) > threeYearsAgo
    );
  },
  action: {
    type: 'MODIFY',
    multiplier: 1.5,
  },
};

export const ALL_RULES = [
  RULE_001,
  RULE_002,
  RULE_003,
  RULE_004,
  RULE_102,
  RULE_103,
  RULE_302,
];
