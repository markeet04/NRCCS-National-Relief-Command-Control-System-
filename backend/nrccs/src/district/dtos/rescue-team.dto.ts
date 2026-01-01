import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsArray,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';
import { RescueTeamStatus } from '../../common/entities/rescue-team.entity';

export class UpdateTeamStatusDto {
  @IsEnum(RescueTeamStatus, { message: 'Invalid team status' })
  status: RescueTeamStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  currentLocation?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateRescueTeamDto {
  @IsString({ message: 'Team name must be a string' })
  @IsNotEmpty({ message: 'Team name is required' })
  @MaxLength(150, { message: 'Team name must be less than 150 characters' })
  name: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  leader?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  leaderName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0?3|92|\+92)?\s?-?\d{9,10}$/, {
    message: 'Contact must be a valid Pakistani phone number',
  })
  contact?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0?3|92|\+92)?\s?-?\d{9,10}$/, {
    message: 'Contact number must be a valid Pakistani phone number',
  })
  contactNumber?: string;

  @IsOptional()
  @IsInt({ message: 'Members must be an integer' })
  @Min(0, { message: 'Members cannot be negative' })
  members?: number;

  @IsOptional()
  @IsInt({ message: 'Member count must be an integer' })
  @Min(0, { message: 'Member count cannot be negative' })
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
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  baseLocation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
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
