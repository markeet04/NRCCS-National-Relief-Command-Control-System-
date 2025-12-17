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
import { SuperadminService } from './superadmin.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/entities/user.entity';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dtos/user.dto';

@Controller('superadmin')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN)
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  // ==================== USER MANAGEMENT ====================

  @Get('users')
  async getAllUsers(@Query('includeDeleted') includeDeleted?: string) {
    const include = includeDeleted === 'true';
    return await this.superadminService.getAllUsers(include);
  }

  @Get('users/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.superadminService.getUserById(id);
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: any,
  ) {
    return await this.superadminService.createUser(createUserDto, user.id);
  }

  @Put('users/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    return await this.superadminService.updateUser(id, updateUserDto, user.id);
  }

  @Put('users/:id/password')
  async changeUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: any,
  ) {
    return await this.superadminService.changeUserPassword(id, changePasswordDto, user.id);
  }

  @Put('users/:id/deactivate')
  async deactivateUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await this.superadminService.deactivateUser(id, user.id);
  }

  @Put('users/:id/activate')
  async activateUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await this.superadminService.activateUser(id, user.id);
  }

  @Delete('users/:id')
  async hardDeleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await this.superadminService.hardDeleteUser(id, user.id);
  }

  @Put('users/:id/restore')
  async restoreUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await this.superadminService.restoreUser(id, user.id);
  }

  // ==================== AUDIT LOGS ====================

  @Get('audit-logs')
  async getAuditLogs(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit) : 100;
    const parsedOffset = offset ? parseInt(offset) : 0;
    return await this.superadminService.getAuditLogs(parsedLimit, parsedOffset);
  }

  @Get('audit-logs/user/:userId')
  async getAuditLogsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit) : 50;
    return await this.superadminService.getAuditLogsByUser(userId, parsedLimit);
  }

  @Get('audit-logs/entity/:entityType/:entityId')
  async getAuditLogsByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return await this.superadminService.getAuditLogsByEntity(entityType, entityId);
  }

  // ==================== ACTIVITY LOGS ====================

  @Get('activity-logs')
  async getActivityLogs(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit) : 100;
    const parsedOffset = offset ? parseInt(offset) : 0;
    return await this.superadminService.getActivityLogs(parsedLimit, parsedOffset);
  }

  // ==================== SYSTEM STATISTICS ====================

  @Get('stats')
  async getSystemStats() {
    return await this.superadminService.getSystemStats();
  }

  // ==================== LOCATION DATA ====================

  @Get('provinces')
  async getAllProvinces() {
    return await this.superadminService.getAllProvinces();
  }

  @Get('provinces/:id/districts')
  async getDistrictsByProvince(@Param('id', ParseIntPipe) provinceId: number) {
    return await this.superadminService.getDistrictsByProvince(provinceId);
  }

  @Get('districts')
  async getAllDistricts() {
    return await this.superadminService.getAllDistricts();
  }
}
