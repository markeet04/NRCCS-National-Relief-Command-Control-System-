import { IsString, IsOptional } from 'class-validator';

export class AssignTeamDto {
  @IsString()
  teamId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
