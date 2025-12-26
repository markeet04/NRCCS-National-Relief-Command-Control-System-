import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { NdmaService } from './ndma.service';
import { FloodPredictionService } from './flood-prediction/flood-prediction.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../common/entities/user.entity';
import { CreateAlertDto } from './dtos/alert.dto';
import { FloodPredictionDto } from './dtos/flood-prediction.dto';
import {
    CreateNationalResourceDto,
    AllocateResourceToProvinceDto,
    ReviewResourceRequestDto,
    IncreaseNationalStockDto
} from './dtos/resource.dto';

@Controller('ndma')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(UserRole.NDMA)
export class NdmaController {
    constructor(
        private readonly ndmaService: NdmaService,
        private readonly floodPredictionService: FloodPredictionService,
    ) { }

    // ==================== DASHBOARD ====================

    @Get('dashboard/stats')
    async getDashboardStats(@CurrentUser() user: User) {
        return await this.ndmaService.getDashboardStats(user);
    }

    @Get('dashboard/provinces')
    async getProvinceSummaries(@CurrentUser() user: User) {
        return await this.ndmaService.getProvinceSummaries(user);
    }

    // ==================== PROVINCES ====================

    @Get('provinces')
    async getAllProvinces(@CurrentUser() user: User) {
        return await this.ndmaService.getAllProvinces(user);
    }

    @Get('provinces/:id')
    async getProvinceById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.getProvinceById(id, user);
    }

    @Get('provinces/:id/stats')
    async getProvinceStats(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.getProvinceStats(id, user);
    }

    // ==================== DISTRICTS ====================

    @Get('districts')
    async getAllDistricts(
        @CurrentUser() user: User,
        @Query('provinceId') provinceId?: string,
        @Query('riskLevel') riskLevel?: string,
    ) {
        const parsedProvinceId = provinceId ? parseInt(provinceId, 10) : undefined;
        return await this.ndmaService.getAllDistricts(user, parsedProvinceId, riskLevel);
    }

    @Get('districts/:id')
    async getDistrictById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.getDistrictById(id, user);
    }

    // ==================== ALERTS ====================

    @Get('alerts')
    async getAllAlerts(
        @CurrentUser() user: User,
        @Query('status') status?: string,
        @Query('severity') severity?: string,
        @Query('provinceId') provinceId?: string,
    ) {
        const parsedProvinceId = provinceId ? parseInt(provinceId, 10) : undefined;
        return await this.ndmaService.getAllAlerts(user, status, severity, parsedProvinceId);
    }

    @Post('alerts')
    @HttpCode(HttpStatus.CREATED)
    async createAlert(
        @Body() createAlertDto: CreateAlertDto,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.createAlert(createAlertDto, user);
    }

    @Put('alerts/:id/resolve')
    async resolveAlert(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.resolveAlert(id, user);
    }

    @Delete('alerts/:id')
    async deleteAlert(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.deleteAlert(id, user);
    }

    // ==================== SHELTERS ====================

    @Get('shelters')
    async getAllShelters(
        @CurrentUser() user: User,
        @Query('status') status?: string,
        @Query('provinceId') provinceId?: string,
    ) {
        const parsedProvinceId = provinceId ? parseInt(provinceId, 10) : undefined;
        return await this.ndmaService.getAllShelters(user, status, parsedProvinceId);
    }

    @Get('shelters/stats')
    async getShelterStats(@CurrentUser() user: User) {
        return await this.ndmaService.getShelterStats(user);
    }

    // ==================== RESOURCES ====================

    @Get('resources')
    async getAllResources(
        @CurrentUser() user: User,
        @Query('status') status?: string,
        @Query('type') type?: string,
    ) {
        return await this.ndmaService.getAllResources(user, status, type);
    }

    @Get('resources/stats')
    async getResourceStats(@CurrentUser() user: User) {
        return await this.ndmaService.getResourceStats(user);
    }

    @Get('resources/by-province')
    async getResourcesByProvince(@CurrentUser() user: User) {
        return await this.ndmaService.getResourcesByProvince(user);
    }

    @Get('resources/national')
    async getNationalResources(@CurrentUser() user: User) {
        return await this.ndmaService.getNationalResources(user);
    }

    @Post('resources')
    @HttpCode(HttpStatus.CREATED)
    async createNationalResource(
        @Body() createDto: CreateNationalResourceDto,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.createNationalResource(createDto, user);
    }

    @Post('resources/:id/increase-stock')
    async increaseNationalStock(
        @Param('id', ParseIntPipe) id: number,
        @Body() increaseDto: IncreaseNationalStockDto,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.increaseNationalStock(id, increaseDto, user);
    }

    @Post('resources/:id/allocate')
    async allocateResourceToProvince(
        @Param('id', ParseIntPipe) id: number,
        @Body() allocateDto: AllocateResourceToProvinceDto,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.allocateResourceToProvince(id, allocateDto, user);
    }

    @Post('allocate-by-type')
    async allocateResourceByType(
        @Body() allocateDto: AllocateResourceToProvinceDto & { resourceType: string },
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.allocateResourceByType(allocateDto, user);
    }

    @Get('resource-requests')
    async getResourceRequests(
        @CurrentUser() user: User,
        @Query('status') status?: string,
    ) {
        return await this.ndmaService.getResourceRequests(user, status);
    }

    @Put('resource-requests/:id/review')
    async reviewResourceRequest(
        @Param('id', ParseIntPipe) id: number,
        @Body() reviewDto: ReviewResourceRequestDto,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.reviewResourceRequest(id, reviewDto, user);
    }

    @Get('allocations/history')
    async getAllocationHistory(
        @CurrentUser() user: User,
        @Query('provinceId') provinceId?: string,
    ) {
        const parsedProvinceId = provinceId ? parseInt(provinceId, 10) : undefined;
        return await this.ndmaService.getNdmaAllocationHistory(user, parsedProvinceId);
    }

    // ==================== SOS REQUESTS ====================

    @Get('sos-requests')
    async getAllSosRequests(
        @CurrentUser() user: User,
        @Query('status') status?: string,
        @Query('priority') priority?: string,
        @Query('provinceId') provinceId?: string,
    ) {
        const parsedProvinceId = provinceId ? parseInt(provinceId, 10) : undefined;
        return await this.ndmaService.getAllSosRequests(user, status, priority, parsedProvinceId);
    }

    @Get('sos-requests/stats')
    async getSosStats(@CurrentUser() user: User) {
        return await this.ndmaService.getSosStats(user);
    }

    @Get('sos-requests/:id')
    async getSosRequestById(
        @Param('id') id: string,
        @CurrentUser() user: User,
    ) {
        return await this.ndmaService.getSosRequestById(id, user);
    }

    // ==================== RESCUE TEAMS ====================

    @Get('rescue-teams')
    async getAllRescueTeams(
        @CurrentUser() user: User,
        @Query('status') status?: string,
        @Query('provinceId') provinceId?: string,
    ) {
        const parsedProvinceId = provinceId ? parseInt(provinceId, 10) : undefined;
        return await this.ndmaService.getAllRescueTeams(user, status, parsedProvinceId);
    }

    @Get('rescue-teams/stats')
    async getRescueTeamStats(@CurrentUser() user: User) {
        return await this.ndmaService.getRescueTeamStats(user);
    }

    // ==================== ACTIVITY LOGS ====================

    @Get('activity-logs')
    async getActivityLogs(
        @CurrentUser() user: User,
        @Query('limit') limit?: string,
        @Query('type') type?: string,
    ) {
        const parsedLimit = limit ? parseInt(limit, 10) : 100;
        return await this.ndmaService.getActivityLogs(user, parsedLimit, type);
    }

    // ==================== FLOOD PREDICTION (ML) ====================

    @Post('flood/predict')
    @HttpCode(HttpStatus.OK)
    async predictFlood(
        @Body() floodPredictionDto: FloodPredictionDto,
        @CurrentUser() user: User,
    ) {
        // Get ML prediction
        const prediction = await this.floodPredictionService.predict(floodPredictionDto, user);

        // Auto-generate alert if requested and risk is Medium/High
        let alertGenerated = false;
        let alertId: number | undefined;

        if (floodPredictionDto.generateAlert && floodPredictionDto.provinceId) {
            if (prediction.flood_risk === 'High' || prediction.flood_risk === 'Medium') {
                const alert = await this.ndmaService.createAlertFromPrediction(
                    prediction,
                    floodPredictionDto.provinceId,
                    user,
                );
                if (alert) {
                    alertGenerated = true;
                    alertId = alert.id;
                }
            }
        }

        return {
            ...prediction,
            alertGenerated,
            alertId,
        };
    }

    /**
     * Get simulation scenarios for flood prediction
     * NDMA-only: Used to select scenario parameters
     */
    @Get('flood/simulation-scenarios')
    async getSimulationScenarios(@CurrentUser() user: User) {
        return this.floodPredictionService.getSimulationScenarios();
    }

    @Get('flood/zones')
    async getFloodZones(@CurrentUser() user: User) {
        return await this.ndmaService.getFloodZones(user);
    }

    // ==================== NATIONAL MAP DATA ====================

    @Get('map/data')
    async getMapData(@CurrentUser() user: User) {
        return await this.ndmaService.getMapData(user);
    }

    @Get('map/provinces')
    async getMapProvinceData(@CurrentUser() user: User) {
        return await this.ndmaService.getMapProvinceData(user);
    }
}
