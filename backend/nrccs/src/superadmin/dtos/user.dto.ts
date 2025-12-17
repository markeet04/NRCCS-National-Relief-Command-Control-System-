import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsBoolean, IsArray, MinLength, Length } from 'class-validator';
import { UserRole, UserLevel } from '../../common/entities/user.entity';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Username must be a string' })
  @IsOptional()
  username?: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEnum(UserRole, { message: 'Invalid user role' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;

  @IsEnum(UserLevel, { message: 'Invalid user level' })
  @IsOptional()
  level?: UserLevel;

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  phone?: string;

  @IsString({ message: 'CNIC must be a string' })
  @Length(13, 15, { message: 'CNIC must be between 13 and 15 characters' })
  @IsOptional()
  cnic?: string;

  @IsOptional()
  provinceId?: number;

  @IsOptional()
  districtId?: number;

  @IsString({ message: 'Location must be a string' })
  @IsOptional()
  location?: string;

  @IsArray({ message: 'Permissions must be an array' })
  @IsOptional()
  permissions?: string[];

  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;
}

export class UpdateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Username must be a string' })
  @IsOptional()
  username?: string;

  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @IsEnum(UserRole, { message: 'Invalid user role' })
  @IsOptional()
  role?: UserRole;

  @IsEnum(UserLevel, { message: 'Invalid user level' })
  @IsOptional()
  level?: UserLevel;

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  phone?: string;

  @IsString({ message: 'CNIC must be a string' })
  @Length(13, 15, { message: 'CNIC must be between 13 and 15 characters' })
  @IsOptional()
  cnic?: string;

  @IsOptional()
  provinceId?: number;

  @IsOptional()
  districtId?: number;

  @IsString({ message: 'Location must be a string' })
  @IsOptional()
  location?: string;

  @IsArray({ message: 'Permissions must be an array' })
  @IsOptional()
  permissions?: string[];

  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
