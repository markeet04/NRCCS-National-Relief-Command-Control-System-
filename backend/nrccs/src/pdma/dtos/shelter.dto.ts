import { IsString, IsInt, IsEnum, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';
import { ShelterStatus } from '../../common/entities/shelter.entity';

export class CreateShelterDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  districtId?: number;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  capacity?: number;

  @IsOptional()
  @IsEnum(ShelterStatus)
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
