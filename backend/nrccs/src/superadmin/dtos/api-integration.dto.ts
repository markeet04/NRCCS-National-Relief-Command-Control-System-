import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateApiIntegrationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsOptional()
  endpoint?: string;

  @IsString()
  @IsOptional()
  endpointUrl?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsObject()
  @IsOptional()
  config?: any;
}

export class UpdateApiIntegrationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsOptional()
  endpoint?: string;

  @IsString()
  @IsOptional()
  endpointUrl?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsObject()
  @IsOptional()
  config?: any;
}

export class TestApiIntegrationDto {
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @IsString()
  @IsOptional()
  apiKey?: string;
}
