import { IsString, IsInt, IsEnum, IsOptional, Min } from 'class-validator';
import { ResourceStatus } from '../../common/entities/resource.entity';

export class CreateResourceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  districtId?: number;

  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AllocateResourceDto {
  @IsInt()
  districtId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  resourceType?: string;
}
