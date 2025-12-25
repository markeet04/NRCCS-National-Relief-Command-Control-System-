import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CivilianService } from './civilian.service';
import { CreateSosDto, CreateMissingPersonDto } from './dtos';

@Controller('civilian')
export class CivilianController {
    constructor(private readonly civilianService: CivilianService) { }

    // ==================== ALERTS ====================

    @Get('alerts')
    async getAllAlerts(
        @Query('severity') severity?: string,
        @Query('limit') limit?: string,
    ) {
        const parsedLimit = limit ? parseInt(limit, 10) : 50;
        return await this.civilianService.getAllAlerts(severity, parsedLimit);
    }

    @Get('alerts/recent')
    async getRecentAlerts(@Query('limit') limit?: string) {
        const parsedLimit = limit ? parseInt(limit, 10) : 3;
        return await this.civilianService.getRecentAlerts(parsedLimit);
    }

    // ==================== SHELTERS ====================

    @Get('shelters')
    async getAllShelters(
        @Query('status') status?: string,
        @Query('districtId') districtId?: string,
    ) {
        const parsedDistrictId = districtId ? parseInt(districtId, 10) : undefined;
        return await this.civilianService.getAllShelters(status, parsedDistrictId);
    }

    // ==================== SOS REQUESTS ====================

    @Post('sos')
    @HttpCode(HttpStatus.CREATED)
    async createSos(@Body() createSosDto: CreateSosDto) {
        return await this.civilianService.createSos(createSosDto);
    }

    // ==================== TRACKING ====================

    @Get('track/:id')
    async trackById(@Param('id') id: string) {
        return await this.civilianService.trackRequestById(id);
    }

    @Get('track')
    async trackByCnic(@Query('cnic') cnic: string) {
        return await this.civilianService.trackRequestsByCnic(cnic);
    }

    // ==================== MISSING PERSONS ====================

    @Get('missing-persons')
    async getAllMissingPersons(
        @Query('status') status?: string,
        @Query('gender') gender?: string,
        @Query('ageRange') ageRange?: string,
    ) {
        return await this.civilianService.getAllMissingPersons(
            status,
            gender,
            ageRange,
        );
    }

    @Post('missing-persons')
    @HttpCode(HttpStatus.CREATED)
    async reportMissingPerson(@Body() dto: CreateMissingPersonDto) {
        return await this.civilianService.createMissingPersonReport(dto);
    }

    // ==================== HELP ====================

    @Get('help')
    async getHelp() {
        return await this.civilianService.getHelpContent();
    }
}
