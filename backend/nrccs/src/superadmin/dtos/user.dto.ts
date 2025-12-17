import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsBoolean, IsArray, MinLength } from 'class-validator';
import { UserRole, UserLevel } from '../../common/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsEnum(UserLevel)
  @IsOptional()
  level?: UserLevel;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  cnic?: string;

  @IsOptional()
  provinceId?: number;

  @IsOptional()
  districtId?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsEnum(UserLevel)
  @IsOptional()
  level?: UserLevel;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  cnic?: string;

  @IsOptional()
  provinceId?: number;

  @IsOptional()
  districtId?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
