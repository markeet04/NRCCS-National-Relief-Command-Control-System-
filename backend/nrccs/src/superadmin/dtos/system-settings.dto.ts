import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateSystemSettingsDto {
  @IsString()
  @IsOptional()
  systemName?: string;

  @IsString()
  @IsOptional()
  alertLevel?: string;

  @IsString()
  @IsOptional()
  sessionTimeout?: string;

  @IsBoolean()
  @IsOptional()
  autoBackup?: boolean;

  @IsBoolean()
  @IsOptional()
  maintenanceMode?: boolean;
}

export class UpdateSettingDto {
  @IsString()
  @IsNotEmpty()
  settingKey: string;

  @IsString()
  @IsNotEmpty()
  settingValue: string;
}
