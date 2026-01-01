import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
  Max,
  Matches,
} from 'class-validator';

/**
 * Emergency types enum - aligned with database ENUM
 */
export enum EmergencyType {
  MEDICAL = 'medical',
  FIRE = 'fire',
  FLOOD = 'flood',
  ACCIDENT = 'accident',
  SECURITY = 'security',
  OTHER = 'other',
}

export class CreateSosDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(150, { message: 'Name must be less than 150 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^(0?3|92)\d{9,10}$/, {
    message: 'Phone must be a valid Pakistani number (e.g., 03001234567)',
  })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'CNIC is required' })
  @Matches(/^\d{13}$/, {
    message: 'CNIC must be exactly 13 digits (without dashes)',
  })
  cnic: string;

  @IsNumber({}, { message: 'Latitude must be a valid number' })
  @IsNotEmpty({ message: 'Location latitude is required' })
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  locationLat: number;

  @IsNumber({}, { message: 'Longitude must be a valid number' })
  @IsNotEmpty({ message: 'Location longitude is required' })
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  locationLng: number;

  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'Location address must be less than 255 characters',
  })
  location?: string;

  @IsNumber()
  @Min(1, { message: 'People count must be at least 1' })
  @IsNotEmpty({ message: 'People count is required' })
  peopleCount: number;

  @IsString()
  @IsNotEmpty({ message: 'Emergency type is required' })
  @IsEnum(EmergencyType, { message: 'Invalid emergency type' })
  emergencyType: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(5, { message: 'Description must be at least 5 characters' })
  description: string;

  @IsNumber({}, { message: 'Province ID must be a valid number' })
  @IsNotEmpty({ message: 'Province is required' })
  provinceId: number;

  @IsNumber({}, { message: 'District ID must be a valid number' })
  @IsNotEmpty({ message: 'District is required' })
  districtId: number;
}
