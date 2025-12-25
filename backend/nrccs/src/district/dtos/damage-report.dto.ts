import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { DamageReportStatus } from '../../common/entities/damage-report.entity';

export class CreateDamageReportDto {
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}

export class VerifyDamageReportDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
