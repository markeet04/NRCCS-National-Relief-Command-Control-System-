import {
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsString,
} from 'class-validator';

/**
 * Simulation scenario types for flood prediction
 */
export enum SimulationScenario {
  NORMAL = 'normal',
  HEAVY_RAIN = 'heavy_rain',
  EXTREME_EVENT = 'extreme_event',
}

/**
 * Flood prediction input DTO
 * Supports both live (real weather) and simulation modes
 */
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

  /**
   * Enable simulation mode for scenario-based predictions
   * When true, uses predefined scenarios instead of actual inputs
   */
  @IsOptional()
  @IsBoolean()
  simulationMode?: boolean;

  /**
   * Simulation scenario (only used when simulationMode is true)
   */
  @IsOptional()
  @IsEnum(SimulationScenario)
  simulationScenario?: SimulationScenario;

  /**
   * Auto-generate alert based on prediction result
   */
  @IsOptional()
  @IsBoolean()
  generateAlert?: boolean;
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
  // NDMA-only fields (filtered out for other roles)
  simulationMode?: boolean;
  simulationScenario?: string;
  alertGenerated?: boolean;
  alertId?: number;
}
