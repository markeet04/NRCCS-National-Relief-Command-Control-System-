import { IsNumber, IsObject, IsOptional, IsBoolean } from 'class-validator';

export class GenerateSuggestionsDto {
  @IsObject()
  mlPrediction: any;

  @IsNumber()
  provinceId: number;

  @IsOptional()
  @IsBoolean()
  autoGenerate?: boolean;
}
