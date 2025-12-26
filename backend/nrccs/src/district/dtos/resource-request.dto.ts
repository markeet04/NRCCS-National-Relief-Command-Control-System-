import {
    IsString,
    IsInt,
    IsEnum,
    IsOptional,
    Min,
    IsNotEmpty
} from 'class-validator';

/**
 * Priority levels for district resource requests
 */
export enum DistrictRequestPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

/**
 * DTO for District creating a resource request to PDMA
 * Note: Districts request specific resources, not via JSONB array
 */
export class CreateDistrictResourceRequestDto {
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

    @IsEnum(DistrictRequestPriority)
    priority: DistrictRequestPriority;

    @IsString()
    @IsNotEmpty()
    justification: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
