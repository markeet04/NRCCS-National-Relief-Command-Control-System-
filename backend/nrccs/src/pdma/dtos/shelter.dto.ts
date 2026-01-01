import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ShelterStatus } from '../../common/entities/shelter.entity';

export class CreateShelterDto {
  @IsString({ message: 'Shelter name must be a string' })
  @IsNotEmpty({ message: 'Shelter name is required' })
  @MaxLength(200, { message: 'Shelter name must be less than 200 characters' })
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsInt({ message: 'District ID must be an integer' })
  districtId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a valid number' })
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  lat?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a valid number' })
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  lng?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Capacity must be at least 0' })
  capacity?: number;

  @IsOptional()
  @IsEnum(ShelterStatus, { message: 'Invalid shelter status' })
  status?: ShelterStatus;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  managerName?: string;

  @IsOptional()
  @IsString()
  managerPhone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  supplyFood?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  supplyWater?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  supplyMedical?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  supplyTents?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  criticalNeeds?: string[];
}

export class UpdateShelterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  capacity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  occupancy?: number;

  @IsOptional()
  @IsEnum(ShelterStatus)
  status?: ShelterStatus;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  managerName?: string;

  @IsOptional()
  @IsString()
  managerPhone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  supplyFood?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  supplyWater?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  supplyMedical?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  supplyTents?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  criticalNeeds?: string[];
}
