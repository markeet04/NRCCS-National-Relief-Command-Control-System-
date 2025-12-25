import { IsNumber, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

/**
 * DTO for allocating resources to a shelter
 */
export class AllocateResourceToShelterDto {
  @IsNumber()
  @IsNotEmpty()
  shelterId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * DTO for updating resource quantity
 */
export class UpdateResourceQuantityDto {
  @IsNumber()
  @Min(0)
  quantity: number;
}
