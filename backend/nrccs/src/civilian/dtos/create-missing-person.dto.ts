import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Gender } from '../../common/entities/missing-person.entity';

export class CreateMissingPersonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(150)
  @IsNotEmpty()
  age: number;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  lastSeenLocation: string;

  @IsDateString()
  @IsNotEmpty()
  lastSeenDate: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsNotEmpty()
  reporterName: string;

  @IsString()
  @IsNotEmpty()
  reporterPhone: string;

  @IsNumber()
  @IsNotEmpty()
  districtId: number;
}
