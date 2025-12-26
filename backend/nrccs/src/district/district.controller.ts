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
import { DistrictService } from './district.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../common/entities/user.entity';
import {
  UpdateSosStatusDto,
  AssignTeamDto,
  AddTimelineEntryDto,
  CreateSosRequestDto,
} from './dtos/sos.dto';
import {
  UpdateTeamStatusDto,
  CreateRescueTeamDto,
  UpdateRescueTeamDto,
} from './dtos/rescue-team.dto';
import {
  CreateShelterDto,
  UpdateShelterDto,
  UpdateShelterSuppliesDto,
  UpdateShelterOccupancyDto,
} from './dtos/shelter.dto';
import {
  CreateDamageReportDto,
  VerifyDamageReportDto,
} from './dtos/damage-report.dto';
import {
  AllocateResourceToShelterDto,
} from './dtos/resource.dto';
import { UpdateMissingPersonStatusDto } from './dtos/update-missing-person-status.dto';
import { CreateDistrictResourceRequestDto } from './dtos/resource-request.dto';

@Controller('district')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(UserRole.DISTRICT)
export class DistrictController {
  constructor(private readonly districtService: DistrictService) { }

  // ==================== DASHBOARD ====================

  @Get('dashboard/stats')
  async getDashboardStats(@CurrentUser() user: User) {
    return await this.districtService.getDashboardStats(user);
  }

  @Get('info')
  async getDistrictInfo(@CurrentUser() user: User) {
    return await this.districtService.getDistrictInfo(user);
  }

  @Get('weather')
  async getWeather(@CurrentUser() user: User) {
    return await this.districtService.getWeather(user);
  }

  // ==================== SOS REQUESTS ====================

  @Get('sos')
  async getAllSosRequests(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.districtService.getAllSosRequests(user, status);
  }

  @Get('sos/stats')
  async getSosStats(@CurrentUser() user: User) {
    return await this.districtService.getSosStats(user);
  }

  @Get('sos/:id')
  async getSosRequestById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.getSosRequestById(id, user);
  }

  @Put('sos/:id/status')
  async updateSosStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSosStatusDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.updateSosStatus(id, dto, user);
  }

  @Put('sos/:id/assign')
  async assignTeamToSos(
    @Param('id') id: string,
    @Body() dto: AssignTeamDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.assignTeamToSos(id, dto, user);
  }

  @Post('sos/:id/timeline')
  @HttpCode(HttpStatus.CREATED)
  async addTimelineEntry(
    @Param('id') id: string,
    @Body() dto: AddTimelineEntryDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.addTimelineEntry(id, dto, user);
  }

  // ==================== RESCUE TEAMS ====================

  @Get('rescue-teams')
  async getAllRescueTeams(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.districtService.getAllRescueTeams(user, status);
  }

  @Get('rescue-teams/stats')
  async getRescueTeamStats(@CurrentUser() user: User) {
    return await this.districtService.getRescueTeamStats(user);
  }

  @Get('rescue-teams/:id')
  async getRescueTeamById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.getRescueTeamById(id, user);
  }

  @Post('rescue-teams')
  @HttpCode(HttpStatus.CREATED)
  async createRescueTeam(
    @Body() dto: CreateRescueTeamDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.createRescueTeam(dto, user);
  }

  @Put('rescue-teams/:id')
  async updateRescueTeam(
    @Param('id') id: string,
    @Body() dto: UpdateRescueTeamDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.updateRescueTeam(id, dto, user);
  }

  @Put('rescue-teams/:id/status')
  async updateTeamStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTeamStatusDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.updateTeamStatus(id, dto, user);
  }

  // ==================== SHELTERS ====================

  @Get('shelters')
  async getAllShelters(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.districtService.getAllShelters(user, status);
  }

  @Get('shelters/stats')
  async getShelterStats(@CurrentUser() user: User) {
    return await this.districtService.getShelterStats(user);
  }

  @Get('shelters/:id')
  async getShelterById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.getShelterById(id, user);
  }

  @Post('shelters')
  @HttpCode(HttpStatus.CREATED)
  async createShelter(
    @Body() dto: CreateShelterDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.createShelter(dto, user);
  }

  @Put('shelters/:id')
  async updateShelter(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShelterDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.updateShelter(id, dto, user);
  }

  @Delete('shelters/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteShelter(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.deleteShelter(id, user);
  }

  @Put('shelters/:id/supplies')
  async updateShelterSupplies(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShelterSuppliesDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.updateShelterSupplies(id, dto, user);
  }

  @Put('shelters/:id/occupancy')
  async updateShelterOccupancy(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShelterOccupancyDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.updateShelterOccupancy(id, dto, user);
  }

  @Put('shelters/:id/reset-supplies')
  @HttpCode(HttpStatus.OK)
  async resetShelterSupplies(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.resetShelterSupplies(id, user);
  }

  // ==================== DAMAGE REPORTS ====================

  @Get('damage-reports')
  async getAllDamageReports(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.districtService.getAllDamageReports(user, status);
  }

  @Get('damage-reports/stats')
  async getDamageReportStats(@CurrentUser() user: User) {
    return await this.districtService.getDamageReportStats(user);
  }

  @Get('damage-reports/:id')
  async getDamageReportById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.getDamageReportById(id, user);
  }

  @Post('damage-reports')
  @HttpCode(HttpStatus.CREATED)
  async createDamageReport(
    @Body() dto: CreateDamageReportDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.createDamageReport(dto, user);
  }

  @Put('damage-reports/:id/verify')
  async verifyDamageReport(
    @Param('id') id: string,
    @Body() dto: VerifyDamageReportDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.verifyDamageReport(id, dto, user);
  }

  // ==================== ALERTS ====================

  @Get('alerts')
  async getAlerts(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.districtService.getAlerts(user, status);
  }

  // ==================== ACTIVITY LOGS ====================

  @Get('activity')
  async getActivityLogs(
    @CurrentUser() user: User,
    @Query('limit') limit?: number,
  ) {
    return await this.districtService.getActivityLogs(user, limit || 20);
  }

  // ==================== RESOURCES ====================

  @Get('resources')
  async getAllResources(@CurrentUser() user: User) {
    return await this.districtService.getAllResources(user);
  }

  @Get('resources/stats')
  async getResourceStats(@CurrentUser() user: User) {
    return await this.districtService.getResourceStats(user);
  }

  @Get('resources/:id')
  async getResourceById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.getResourceById(id, user);
  }

  @Put('resources/:id/allocate-to-shelter')
  async allocateResourceToShelter(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AllocateResourceToShelterDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.allocateResourceToShelter(id, dto, user);
  }

  @Get('shelters-for-allocation')
  async getSheltersForAllocation(@CurrentUser() user: User) {
    return await this.districtService.getSheltersForAllocation(user);
  }

  // ==================== MISSING PERSONS ====================

  @Get('missing-persons')
  async getMissingPersons(
    @CurrentUser() user: User,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return await this.districtService.getMissingPersons(user, status, search);
  }

  @Get('missing-persons/stats')
  async getMissingPersonStats(@CurrentUser() user: User) {
    return await this.districtService.getMissingPersonStats(user);
  }

  @Get('missing-persons/:id')
  async getMissingPersonById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.getMissingPersonById(id, user);
  }

  @Put('missing-persons/:id/status')
  async updateMissingPersonStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMissingPersonStatusDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.updateMissingPersonStatus(id, dto, user);
  }

  @Post('missing-persons/check-auto-dead')
  @HttpCode(HttpStatus.OK)
  async triggerAutoDeadCheck(@CurrentUser() user: User) {
    // Manual trigger for testing - only accessible to district users
    return await this.districtService.checkAndMarkDeadPersons();
  }

  // ==================== RESOURCE REQUESTS ====================

  @Post('resource-requests')
  @HttpCode(HttpStatus.CREATED)
  async createResourceRequest(
    @Body() dto: CreateDistrictResourceRequestDto,
    @CurrentUser() user: User,
  ) {
    return await this.districtService.createResourceRequest(dto, user);
  }

  @Get('resource-requests')
  async getOwnResourceRequests(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.districtService.getOwnResourceRequests(user, status);
  }
}
