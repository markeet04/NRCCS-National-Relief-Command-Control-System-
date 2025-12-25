import { IsNumber, Min, IsOptional } from 'class-validator';

export class FloodPredictionDto {
    @IsNumber()
    @Min(0)
    rainfall_24h: number;

    @IsNumber()
    @Min(0)
    rainfall_48h: number;

    @IsNumber()
    @Min(0)
    humidity: number;

    @IsNumber()
    temperature: number;

    @IsOptional()
    @IsNumber()
    districtId?: number;

    @IsOptional()
    @IsNumber()
    provinceId?: number;
}

export class FloodPredictionResponseDto {
    flood_risk: 'Low' | 'Medium' | 'High';
    prediction_binary: 0 | 1;
    confidence: number;
    input_summary?: {
        mapped_rain_mm: number;
        temperature: number;
        humidity_provided: number;
    };
}
