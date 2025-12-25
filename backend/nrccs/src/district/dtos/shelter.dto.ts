import { IsString, IsOptional, IsInt, Min, Max, IsArray, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ShelterStatus } from '../../common/entities/shelter.entity';

export class CreateShelterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsInt()
  @Min(0)
  capacity: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  occupancy?: number;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

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
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}

export class UpdateShelterSuppliesDto {
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
}

export class UpdateShelterOccupancyDto {
  @IsInt()
  @Min(0)
  occupancy: number;
}
