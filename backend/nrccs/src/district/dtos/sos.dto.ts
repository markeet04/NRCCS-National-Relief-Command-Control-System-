import { IsString, IsOptional, IsEnum, IsInt, Min, IsNumber, IsArray } from 'class-validator';
import { SosStatus, SosPriority } from '../../common/entities/sos-request.entity';

export class UpdateSosStatusDto {
  @IsEnum(SosStatus)
  status: SosStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AssignTeamDto {
  @IsString()
  teamId: string;

  @IsOptional()
  @IsString()
  estimatedArrival?: string;
}

export class AddTimelineEntryDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateSosRequestDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  locationLat?: number;

  @IsOptional()
  @IsNumber()
  locationLng?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  peopleCount?: number;

  @IsOptional()
  @IsString()
  emergencyType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(SosPriority)
  priority?: SosPriority;
}
