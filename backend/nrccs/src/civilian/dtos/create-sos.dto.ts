import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsEnum,
    IsOptional,
    MinLength,
    Min,
    Max,
    Matches,
} from 'class-validator';

export class CreateSosDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(0?3|92)\d{9,10}$/, {
        message: 'Phone must be a valid Pakistani number (e.g., 03001234567)',
    })
    phone: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{13}$/, {
        message: 'CNIC must be exactly 13 digits',
    })
    cnic: string;

    @IsNumber()
    @IsNotEmpty()
    locationLat: number;

    @IsNumber()
    @IsNotEmpty()
    locationLng: number;

    @IsString()
    @IsOptional()
    location?: string;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    peopleCount: number;

    @IsString()
    @IsNotEmpty()
    emergencyType: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    description: string;

    @IsNumber()
    @IsOptional()
    provinceId?: number;

    @IsNumber()
    @IsOptional()
    districtId?: number;
}
