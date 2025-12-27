import { Injectable } from '@nestjs/common';
import {
  Rule,
  RuleFacts,
  RuleEvaluationResult,
  SuggestionAction,
} from './rule.interface';

@Injectable()
export class RuleEngine {
  private rules: Rule[] = [];

  registerRule(rule: Rule): void {
    this.rules.push(rule);
    // Sort by priority (lower number = higher priority)
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  registerRules(rules: Rule[]): void {
    rules.forEach((rule) => this.registerRule(rule));
  }

  async evaluate(facts: RuleFacts): Promise<RuleEvaluationResult> {
    const matchedRules: string[] = [];
    const flags: string[] = [];
    const suggestions: SuggestionAction[] = [];
    const quantityModifiers: number[] = [];

    // Execute rules by priority
    for (const rule of this.rules) {
      try {
        if (rule.condition(facts)) {
          matchedRules.push(rule.id);

          switch (rule.action.type) {
            case 'SUGGEST_ALLOCATION':
              if (rule.action.quantityCalculator && rule.action.resourceType) {
                const quantity = rule.action.quantityCalculator(facts);
                if (quantity > 0) {
                  suggestions.push({
                    ruleId: rule.id,
                    resourceType: rule.action.resourceType,
                    quantity,
                  });
                }
              }
              break;

            case 'FLAG':
              if (rule.action.flag && !flags.includes(rule.action.flag)) {
                flags.push(rule.action.flag);
              }
              break;

            case 'MODIFY':
              if (rule.action.multiplier) {
                quantityModifiers.push(rule.action.multiplier);
              }
              break;
          }
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
      }
    }

    return {
      matchedRules,
      suggestions,
      flags,
      quantityModifiers,
    };
  }

  getRules(): Rule[] {
    return this.rules;
  }

  getRuleById(id: string): Rule | undefined {
    return this.rules.find((rule) => rule.id === id);
  }
}
