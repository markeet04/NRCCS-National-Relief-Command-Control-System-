import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsArray,
  IsDateString,
  Min,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AlertSeverity, AlertType } from '../../common/entities/alert.entity';

export class CreateAlertDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Alert title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(255, { message: 'Title must be less than 255 characters' })
  title: string;

  @IsOptional()
  @IsEnum(AlertType, { message: 'Invalid alert type' })
  type?: AlertType;

  @IsOptional()
  @IsString()
  alertType?: string;

  @IsOptional()
  @IsEnum(AlertSeverity, { message: 'Invalid severity level' })
  severity?: AlertSeverity;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must be less than 500 characters' })
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
