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
import { PdmaService } from './pdma.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../common/entities/user.entity';
import { CreateShelterDto, UpdateShelterDto } from './dtos/shelter.dto';
import { CreateAlertDto } from './dtos/alert.dto';
import { CreateResourceDto, UpdateResourceDto, AllocateResourceDto } from './dtos/resource.dto';
import { AssignTeamDto } from './dtos/sos.dto';
import { CreateResourceRequestDto } from './dtos/resource-request.dto';

@Controller('pdma')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(UserRole.PDMA)
export class PdmaController {
  constructor(private readonly pdmaService: PdmaService) { }

  // ==================== DASHBOARD ====================

  @Get('dashboard/stats')
  async getDashboardStats(@CurrentUser() user: User) {
    return await this.pdmaService.getDashboardStats(user);
  }

  // ==================== DISTRICTS ====================

  @Get('districts')
  async getAllDistricts(@CurrentUser() user: User) {
    return await this.pdmaService.getAllDistricts(user);
  }

  @Get('districts/:id')
  async getDistrictById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.getDistrictById(id, user);
  }

  @Get('districts/:id/stats')
  async getDistrictStats(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.getDistrictStats(id, user);
  }

  // ==================== ALERTS ====================

  @Get('alerts')
  async getAllAlerts(
    @CurrentUser() user: User,
    @Query('status') status?: string,
    @Query('severity') severity?: string,
  ) {
    return await this.pdmaService.getAllAlerts(user, status, severity);
  }

  @Post('alerts')
  @HttpCode(HttpStatus.CREATED)
  async createAlert(
    @Body() createAlertDto: CreateAlertDto,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.createAlert(createAlertDto, user);
  }

  @Put('alerts/:id/resolve')
  async resolveAlert(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.resolveAlert(id, user);
  }

  @Delete('alerts/:id')
  async deleteAlert(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.deleteAlert(id, user);
  }

  // ==================== SHELTERS ====================

  @Get('shelters')
  async getAllShelters(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.pdmaService.getAllShelters(user, status);
  }

  @Get('shelters/stats')
  async getShelterStats(@CurrentUser() user: User) {
    return await this.pdmaService.getShelterStats(user);
  }

  @Get('shelters/:id')
  async getShelterById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.getShelterById(id, user);
  }

  @Post('shelters')
  @HttpCode(HttpStatus.CREATED)
  async createShelter(
    @Body() createShelterDto: CreateShelterDto,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.createShelter(createShelterDto, user);
  }

  @Put('shelters/:id')
  async updateShelter(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShelterDto: UpdateShelterDto,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.updateShelter(id, updateShelterDto, user);
  }

  @Delete('shelters/:id')
  async deleteShelter(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.deleteShelter(id, user);
  }

  // ==================== RESOURCES ====================

  @Get('resources')
  async getAllResources(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.pdmaService.getAllResources(user, status);
  }

  @Get('resources/stats')
  async getResourceStats(@CurrentUser() user: User) {
    return await this.pdmaService.getResourceStats(user);
  }

  @Post('resources')
  @HttpCode(HttpStatus.CREATED)
  async createResource(
    @Body() createResourceDto: CreateResourceDto,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.createResource(createResourceDto, user);
  }

  @Put('resources/:id')
  async updateResource(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResourceDto: UpdateResourceDto,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.updateResource(id, updateResourceDto, user);
  }

  @Post('resources/:id/allocate')
  async allocateResource(
    @Param('id', ParseIntPipe) id: number,
    @Body() allocateDto: AllocateResourceDto,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.allocateResource(id, allocateDto, user);
  }

  @Post('resource-requests')
  @HttpCode(HttpStatus.CREATED)
  async createResourceRequest(
    @Body() createDto: CreateResourceRequestDto,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.createResourceRequest(createDto, user);
  }

  @Get('resource-requests')
  async getOwnResourceRequests(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.pdmaService.getOwnResourceRequests(user, status);
  }

  @Get('district-requests')
  async getDistrictRequests(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.pdmaService.getDistrictRequests(user, status);
  }

  @Put('district-requests/:id/review')
  async reviewDistrictRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() reviewDto: { status: string; notes?: string },
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.reviewDistrictRequest(id, reviewDto as any, user);
  }

  // ==================== SOS REQUESTS ====================

  @Get('sos-requests')
  async getAllSosRequests(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.pdmaService.getAllSosRequests(user, status);
  }

  @Get('sos-requests/:id')
  async getSosRequestById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.getSosRequestById(id, user);
  }

  @Put('sos-requests/:id/assign-team')
  async assignTeamToSos(
    @Param('id') id: string,
    @Body() assignTeamDto: AssignTeamDto,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.assignTeamToSos(id, assignTeamDto, user);
  }

  // ==================== RESCUE TEAMS ====================

  @Get('rescue-teams')
  async getAllRescueTeams(
    @CurrentUser() user: User,
    @Query('status') status?: string,
  ) {
    return await this.pdmaService.getAllRescueTeams(user, status);
  }

  @Get('rescue-teams/:id')
  async getRescueTeamById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return await this.pdmaService.getRescueTeamById(id, user);
  }

  // ==================== ACTIVITY LOGS ====================

  @Get('activity-logs')
  async getActivityLogs(
    @CurrentUser() user: User,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return await this.pdmaService.getActivityLogs(user, parsedLimit);
  }

  // ==================== PROVINCIAL MAP ====================

  @Get('map/data')
  async getMapData(@CurrentUser() user: User) {
    return await this.pdmaService.getMapData(user);
  }
}
