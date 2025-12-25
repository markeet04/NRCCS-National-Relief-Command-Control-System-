import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import { FloodPredictionDto, FloodPredictionResponseDto } from '../dtos/flood-prediction.dto';
import { User } from '../../common/entities/user.entity';

@Injectable()
export class FloodPredictionService {
    private readonly pythonScript: string;
    private readonly timeout: number = 30000; // 30 seconds timeout

    constructor() {
        // Path to the predict_flood.py script relative to project root
        this.pythonScript = path.join(process.cwd(), '..', '..', 'Artiint', 'predict_flood.py');
    }

    /**
     * Run flood prediction using the trained ML model
     */
    async predict(dto: FloodPredictionDto, user: User): Promise<FloodPredictionResponseDto> {
        // Validate inputs
        if (dto.rainfall_24h < 0 || dto.rainfall_48h < 0 || dto.humidity < 0) {
            throw new BadRequestException('Rainfall and humidity values must be non-negative');
        }

        if (dto.temperature < -50 || dto.temperature > 60) {
            throw new BadRequestException('Temperature must be between -50 and 60°C');
        }

        try {
            const result = await this.executePythonModel(
                dto.rainfall_24h,
                dto.rainfall_48h,
                dto.humidity,
                dto.temperature,
            );

            console.log(`[FloodPrediction] User ${user.name} ran prediction: ${result.flood_risk} (${result.confidence})`);

            return result;
        } catch (error) {
            console.error('[FloodPrediction] Model execution failed:', error);

            // Return fallback prediction based on simple rules if model fails
            return this.fallbackPrediction(dto);
        }
    }

    /**
     * Execute the Python ML model via subprocess
     */
    private executePythonModel(
        rainfall_24h: number,
        rainfall_48h: number,
        humidity: number,
        temperature: number,
    ): Promise<FloodPredictionResponseDto> {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [
                this.pythonScript,
                rainfall_24h.toString(),
                rainfall_48h.toString(),
                humidity.toString(),
                temperature.toString(),
            ]);

            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            // Set timeout
            const timeoutId = setTimeout(() => {
                pythonProcess.kill();
                reject(new Error('Model execution timeout'));
            }, this.timeout);

            pythonProcess.on('close', (code) => {
                clearTimeout(timeoutId);

                if (code !== 0) {
                    console.error(`[FloodPrediction] Python process exited with code ${code}`);
                    console.error(`[FloodPrediction] stderr: ${stderr}`);
                    reject(new Error(`Model execution failed with code ${code}`));
                    return;
                }

                try {
                    const result = JSON.parse(stdout.trim());

                    if (result.error) {
                        reject(new Error(result.error));
                        return;
                    }

                    resolve({
                        flood_risk: result.flood_risk,
                        prediction_binary: result.prediction_binary,
                        confidence: result.confidence,
                        input_summary: result.input_summary,
                    });
                } catch (parseError) {
                    console.error('[FloodPrediction] Failed to parse model output:', stdout);
                    reject(new Error('Failed to parse model output'));
                }
            });

            pythonProcess.on('error', (error) => {
                clearTimeout(timeoutId);
                reject(error);
            });
        });
    }

    /**
     * Fallback prediction when ML model is unavailable
     * Uses simple rule-based logic
     */
    private fallbackPrediction(dto: FloodPredictionDto): FloodPredictionResponseDto {
        console.warn('[FloodPrediction] Using fallback prediction (ML model unavailable)');

        const totalRain = dto.rainfall_24h + dto.rainfall_48h;

        let flood_risk: 'Low' | 'Medium' | 'High';
        let prediction_binary: 0 | 1;
        let confidence: number;

        if (totalRain > 150) {
            flood_risk = 'High';
            prediction_binary = 1;
            confidence = 0.85;
        } else if (totalRain > 80) {
            flood_risk = 'Medium';
            prediction_binary = 1;
            confidence = 0.65;
        } else if (totalRain > 40) {
            flood_risk = 'Low';
            prediction_binary = 0;
            confidence = 0.70;
        } else {
            flood_risk = 'Low';
            prediction_binary = 0;
            confidence = 0.90;
        }

        return {
            flood_risk,
            prediction_binary,
            confidence,
            input_summary: {
                mapped_rain_mm: totalRain,
                temperature: dto.temperature,
                humidity_provided: dto.humidity,
            },
        };
    }
}
