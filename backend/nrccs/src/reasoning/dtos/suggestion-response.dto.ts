export class SuggestionResponseDto {
  id: number;
  suggestionType: string;
  provinceId: number;
  provinceName?: string;
  resourceType: string;
  suggestedQuantity: number;
  reasoning: string;
  ruleIds: string[];
  confidenceScore: number;
  mlPredictionData: any;
  status: string;
  flags: string[];
  createdAt: Date;
  reviewedAt?: Date;
  rejectionReason?: string;
  executionStatus?: string;
  allocationId?: number;
}
