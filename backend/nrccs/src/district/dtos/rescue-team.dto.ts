import { IsString, IsOptional, IsEnum, IsInt, Min, IsArray } from 'class-validator';
import { RescueTeamStatus } from '../../common/entities/rescue-team.entity';

export class UpdateTeamStatusDto {
  @IsEnum(RescueTeamStatus)
  status: RescueTeamStatus;

  @IsOptional()
  @IsString()
  currentLocation?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateRescueTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  leader?: string;

  @IsOptional()
  @IsString()
  leaderName?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  members?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  memberCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  compositionMedical?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  compositionRescue?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  compositionSupport?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  baseLocation?: string;

  @IsOptional()
  @IsString()
  currentLocation?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRescueTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  leader?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  members?: number;

  @IsOptional()
  @IsEnum(RescueTeamStatus)
  status?: RescueTeamStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment?: string[];

  @IsOptional()
  @IsString()
  leaderName?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsString()
  baseLocation?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  memberCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  compositionMedical?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  compositionRescue?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  compositionSupport?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
