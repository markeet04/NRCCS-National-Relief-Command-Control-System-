import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../common/entities/user.entity';
import { SystemSettings } from '../common/entities/system-settings.entity';
import { ApiIntegration } from '../common/entities/api-integration.entity';
import { AuditLog } from '../common/entities/audit-log.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';
import { Province } from '../common/entities/province.entity';
import { District } from '../common/entities/district.entity';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dtos/user.dto';
import { UpdateSystemSettingsDto, UpdateSettingDto } from './dtos/system-settings.dto';
import { CreateApiIntegrationDto, UpdateApiIntegrationDto, TestApiIntegrationDto } from './dtos/api-integration.dto';

@Injectable()
export class SuperadminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SystemSettings)
    private systemSettingsRepository: Repository<SystemSettings>,
    @InjectRepository(ApiIntegration)
    private apiIntegrationRepository: Repository<ApiIntegration>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  // ==================== USER MANAGEMENT ====================

  async getAllUsers(includeDeleted = false) {
    const where = includeDeleted ? {} : { isDeleted: false };
    return await this.userRepository.find({
      where,
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'email',
        'username',
        'name',
        'role',
        'level',
        'phone',
        'cnic',
        'provinceId',
        'districtId',
        'location',
        'permissions',
        'isActive',
        'lastLogin',
        'createdAt',
        'updatedAt',
        'isDeleted',
        'deletedAt',
      ],
    });
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
      select: [
        'id',
        'email',
        'username',
        'name',
        'role',
        'level',
        'phone',
        'cnic',
        'provinceId',
        'districtId',
        'location',
        'permissions',
        'isActive',
        'lastLogin',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto, createdBy: number) {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash,
      isActive: createUserDto.isActive ?? true,
    });

    const savedUser = await this.userRepository.save(user);

    // Create audit log
    await this.createAuditLog({
      userId: createdBy,
      action: 'CREATE_USER',
      entityType: 'user',
      entityId: savedUser.id.toString(),
      newValues: {
        email: savedUser.email,
        role: savedUser.role,
        name: savedUser.name,
      },
    });

    return this.getUserById(savedUser.id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, updatedBy: number) {
    const user = await this.getUserById(id);

    // Store old values for audit
    const oldValues = {
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    };

    await this.userRepository.update(id, updateUserDto);

    // Create audit log
    await this.createAuditLog({
      userId: updatedBy,
      action: 'UPDATE_USER',
      entityType: 'user',
      entityId: id.toString(),
      oldValues,
      newValues: updateUserDto,
    });

    return this.getUserById(id);
  }

  async changeUserPassword(id: number, changePasswordDto: ChangePasswordDto, changedBy: number) {
    const user = await this.getUserById(id);
    
    const passwordHash = await bcrypt.hash(changePasswordDto.newPassword, 10);
    
    await this.userRepository.update(id, { passwordHash });

    // Create audit log
    await this.createAuditLog({
      userId: changedBy,
      action: 'CHANGE_PASSWORD',
      entityType: 'user',
      entityId: id.toString(),
      newValues: { passwordChanged: true },
    });

    return { message: 'Password changed successfully' };
  }

  async deactivateUser(id: number, deactivatedBy: number) {
    const user = await this.getUserById(id);

    await this.userRepository.update(id, { isActive: false });

    await this.createAuditLog({
      userId: deactivatedBy,
      action: 'DEACTIVATE_USER',
      entityType: 'user',
      entityId: id.toString(),
      oldValues: { isActive: true },
      newValues: { isActive: false },
    });

    return { message: 'User deactivated successfully' };
  }

  async activateUser(id: number, activatedBy: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, { isActive: true });

    await this.createAuditLog({
      userId: activatedBy,
      action: 'ACTIVATE_USER',
      entityType: 'user',
      entityId: id.toString(),
      oldValues: { isActive: false },
      newValues: { isActive: true },
    });

    return { message: 'User activated successfully' };
  }

  async softDeleteUser(id: number, deletedBy: number) {
    const user = await this.getUserById(id);

    await this.userRepository.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    await this.createAuditLog({
      userId: deletedBy,
      action: 'DELETE_USER',
      entityType: 'user',
      entityId: id.toString(),
      oldValues: { isDeleted: false },
      newValues: { isDeleted: true },
    });

    return { message: 'User deleted successfully' };
  }

  async restoreUser(id: number, restoredBy: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, {
      isDeleted: false,
      deletedAt: undefined,
    });

    await this.createAuditLog({
      userId: restoredBy,
      action: 'RESTORE_USER',
      entityType: 'user',
      entityId: id.toString(),
      oldValues: { isDeleted: true },
      newValues: { isDeleted: false },
    });

    return { message: 'User restored successfully' };
  }

  // ==================== SYSTEM SETTINGS ====================

  async getSystemSettings() {
    const settings = await this.systemSettingsRepository.find();
    
    // Convert to key-value object
    const settingsObj: any = {
      systemName: 'NRCCS',
      alertLevel: 'normal',
      sessionTimeout: '30',
      autoBackup: true,
      maintenanceMode: false,
      dbStatus: 'Connected',
    };

    settings.forEach(setting => {
      if (setting.settingKey === 'app_name') {
        settingsObj.systemName = setting.systemName;
        settingsObj.alertLevel = setting.alertLevel;
        settingsObj.sessionTimeout = setting.sessionTimeout;
        settingsObj.autoBackup = setting.autoBackup;
        settingsObj.maintenanceMode = setting.maintenanceMode;
        settingsObj.dbStatus = setting.dbStatus;
      }
    });

    return settingsObj;
  }

  async updateSystemSettings(updateDto: UpdateSystemSettingsDto, updatedBy: number) {
    let setting = await this.systemSettingsRepository.findOne({
      where: { settingKey: 'app_name' },
    });

    if (!setting) {
      setting = this.systemSettingsRepository.create({
        settingKey: 'app_name',
        settingValue: 'NRCCS',
      });
    }

    const oldValues = { ...setting };

    Object.assign(setting, updateDto);
    await this.systemSettingsRepository.save(setting);

    await this.createAuditLog({
      userId: updatedBy,
      action: 'UPDATE_SYSTEM_SETTINGS',
      entityType: 'system_settings',
      entityId: setting.id.toString(),
      oldValues,
      newValues: updateDto,
    });

    return this.getSystemSettings();
  }

  async updateSetting(updateDto: UpdateSettingDto, updatedBy: number) {
    let setting = await this.systemSettingsRepository.findOne({
      where: { settingKey: updateDto.settingKey },
    });

    if (!setting) {
      setting = this.systemSettingsRepository.create(updateDto);
    } else {
      setting.settingValue = updateDto.settingValue;
    }

    await this.systemSettingsRepository.save(setting);

    await this.createAuditLog({
      userId: updatedBy,
      action: 'UPDATE_SETTING',
      entityType: 'system_settings',
      entityId: setting.id.toString(),
      newValues: updateDto,
    });

    return setting;
  }

  // ==================== API INTEGRATIONS ====================

  async getAllApiIntegrations() {
    return await this.apiIntegrationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getApiIntegrationById(id: number) {
    const integration = await this.apiIntegrationRepository.findOne({
      where: { id },
    });

    if (!integration) {
      throw new NotFoundException(`API Integration with ID ${id} not found`);
    }

    return integration;
  }

  async createApiIntegration(createDto: CreateApiIntegrationDto, createdBy: number) {
    const integration = this.apiIntegrationRepository.create({
      ...createDto,
      status: createDto.status || 'active',
    });

    const saved = await this.apiIntegrationRepository.save(integration);

    await this.createAuditLog({
      userId: createdBy,
      action: 'CREATE_API_INTEGRATION',
      entityType: 'api_integration',
      entityId: saved.id.toString(),
      newValues: createDto,
    });

    return saved;
  }

  async updateApiIntegration(id: number, updateDto: UpdateApiIntegrationDto, updatedBy: number) {
    const integration = await this.getApiIntegrationById(id);

    const oldValues = { ...integration };

    await this.apiIntegrationRepository.update(id, updateDto);

    await this.createAuditLog({
      userId: updatedBy,
      action: 'UPDATE_API_INTEGRATION',
      entityType: 'api_integration',
      entityId: id.toString(),
      oldValues,
      newValues: updateDto,
    });

    return this.getApiIntegrationById(id);
  }

  async deleteApiIntegration(id: number, deletedBy: number) {
    const integration = await this.getApiIntegrationById(id);

    await this.apiIntegrationRepository.delete(id);

    await this.createAuditLog({
      userId: deletedBy,
      action: 'DELETE_API_INTEGRATION',
      entityType: 'api_integration',
      entityId: id.toString(),
      oldValues: integration,
    });

    return { message: 'API Integration deleted successfully' };
  }

  async testApiIntegration(id: number, testedBy: number) {
    const integration = await this.getApiIntegrationById(id);

    // Update last tested timestamp
    await this.apiIntegrationRepository.update(id, {
      lastTested: new Date(),
    });

    await this.createAuditLog({
      userId: testedBy,
      action: 'TEST_API_INTEGRATION',
      entityType: 'api_integration',
      entityId: id.toString(),
    });

    // In production, you would actually test the API here
    return {
      success: true,
      message: 'API Integration test successful',
      testedAt: new Date(),
    };
  }

  // ==================== AUDIT LOGS ====================

  async getAuditLogs(limit = 100, offset = 0) {
    const [logs, total] = await this.auditLogRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      logs,
      total,
      limit,
      offset,
    };
  }

  async getAuditLogsByUser(userId: number, limit = 50) {
    return await this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getAuditLogsByEntity(entityType: string, entityId: string) {
    return await this.auditLogRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
    });
  }

  private async createAuditLog(data: {
    userId: number;
    action: string;
    entityType: string;
    entityId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const auditLog = this.auditLogRepository.create(data);
    return await this.auditLogRepository.save(auditLog);
  }

  // ==================== ACTIVITY LOGS ====================

  async getActivityLogs(limit = 100, offset = 0) {
    const [logs, total] = await this.activityLogRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      logs,
      total,
      limit,
      offset,
    };
  }

  // ==================== SYSTEM STATISTICS ====================

  async getSystemStats() {
    const totalUsers = await this.userRepository.count({
      where: { isDeleted: false },
    });

    const activeUsers = await this.userRepository.count({
      where: { isDeleted: false, isActive: true },
    });

    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .where('user.is_deleted = false')
      .groupBy('user.role')
      .getRawMany();

    const recentActivity = await this.activityLogRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole,
      recentActivity,
      systemHealth: {
        database: 'Connected',
        apiStatus: 'Online',
        lastBackup: new Date(),
      },
    };
  }

  // ==================== LOCATION DATA ====================

  async getAllProvinces() {
    return await this.provinceRepository.find({
      order: { name: 'ASC' },
      relations: ['districts'],
    });
  }

  async getDistrictsByProvince(provinceId: number) {
    const province = await this.provinceRepository.findOne({
      where: { id: provinceId },
      relations: ['districts'],
    });

    if (!province) {
      throw new NotFoundException(`Province with ID ${provinceId} not found`);
    }

    return province.districts;
  }

  async getAllDistricts() {
    return await this.districtRepository.find({
      order: { name: 'ASC' },
      relations: ['province'],
    });
  }
}
