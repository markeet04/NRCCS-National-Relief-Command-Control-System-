import { IsString, IsOptional, MinLength } from 'class-validator';

export class ReviewSuggestionDto {
  @IsString()
  @MinLength(10)
  @IsOptional()
  reason?: string;
}

export class RejectSuggestionDto {
  @IsString()
  @MinLength(10)
  reason: string;
}
