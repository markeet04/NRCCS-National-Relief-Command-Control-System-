import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class LoginResponseDto {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    level?: string;
    provinceId?: number;
    districtId?: number;
  };
}
