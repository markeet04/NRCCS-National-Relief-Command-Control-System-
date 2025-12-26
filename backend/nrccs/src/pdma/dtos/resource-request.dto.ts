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
import { ResourceRequestPriority } from '../../common/entities/resource-request.entity';

/**
 * DTO for a single resource request item
 */
export class RequestedResourceItemDto {
    @IsString()
    @IsNotEmpty()
    resourceType: string;

    @IsString()
    @IsNotEmpty()
    resourceName: string;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsString()
    @IsNotEmpty()
    unit: string;
}

/**
 * DTO for PDMA creating a resource request to NDMA
 */
export class CreateResourceRequestDto {
    @IsEnum(ResourceRequestPriority)
    priority: ResourceRequestPriority;

    @IsString()
    @IsNotEmpty()
    reason: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestedResourceItemDto)
    requestedItems: RequestedResourceItemDto[];
}
