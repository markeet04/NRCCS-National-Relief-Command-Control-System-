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
  leader?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  members?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment?: string[];
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
}
