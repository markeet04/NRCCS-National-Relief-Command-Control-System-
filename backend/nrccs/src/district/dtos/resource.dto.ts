import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsInt,
} from 'class-validator';

/**
 * DTO for allocating resources to a shelter
 */
export class AllocateResourceToShelterDto {
  @IsInt()
  @IsNotEmpty()
  shelterId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  resourceType?: string;
}

/**
 * DTO for updating resource quantity
 */
export class UpdateResourceQuantityDto {
  @IsNumber()
  @Min(0)
  quantity: number;
}
