import { IsString, IsInt, IsEnum, IsOptional, IsArray, IsDateString, Min } from 'class-validator';
import { AlertSeverity, AlertType } from '../../common/entities/alert.entity';

export class CreateAlertDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(AlertType)
  type?: AlertType;

  @IsOptional()
  @IsString()
  alertType?: string;

  @IsOptional()
  @IsEnum(AlertSeverity)
  severity?: AlertSeverity;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedAreas?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendedActions?: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  districtIds?: number[];

  @IsOptional()
  @IsInt()
  districtId?: number;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class UpdateAlertDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(AlertSeverity)
  severity?: AlertSeverity;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedAreas?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendedActions?: string[];

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
