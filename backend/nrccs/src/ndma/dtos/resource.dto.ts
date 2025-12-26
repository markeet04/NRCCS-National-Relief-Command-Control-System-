import {
    IsString,
    IsInt,
    IsEnum,
    IsOptional,
    Min,
    IsArray,
    ValidateNested,
    IsNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';
import { ResourceStatus } from '../../common/entities/resource.entity';
import { ResourceRequestStatus } from '../../common/entities/resource-request.entity';

/**
 * DTO for creating national-level resources
 */
export class CreateNationalResourceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsInt()
    @Min(0)
    quantity: number;

    @IsString()
    unit: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

/**
 * DTO for allocating resources from NDMA to PDMA (Province)
 */
export class AllocateResourceToProvinceDto {
    @IsInt()
    @IsNotEmpty()
    provinceId: number;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsOptional()
    @IsString()
    purpose?: string;

    @IsOptional()
    @IsString()
    priority?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

/**
 * DTO for resource request item
 */
export class ResourceRequestItemDto {
    @IsString()
    resourceType: string;

    @IsString()
    resourceName: string;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsString()
    unit: string;
}

/**
 * DTO for reviewing a resource request from PDMA
 */
export class ReviewResourceRequestDto {
    @IsEnum(ResourceRequestStatus)
    status: ResourceRequestStatus;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResourceRequestItemDto)
    approvedItems?: ResourceRequestItemDto[];
}

/**
 * DTO for increasing national stock
 */
export class IncreaseNationalStockDto {
    @IsInt()
    @Min(1)
    quantity: number;

    @IsOptional()
    @IsString()
    notes?: string;
}
