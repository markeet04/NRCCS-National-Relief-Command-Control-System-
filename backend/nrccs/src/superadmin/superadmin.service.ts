import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../common/entities/user.entity';
import { AuditLog } from '../common/entities/audit-log.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';
import { Province } from '../common/entities/province.entity';
import { District } from '../common/entities/district.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
} from './dtos/user.dto';

@Injectable()
export class SuperadminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    // Check for existing email, username, and cnic
    const conflicts: { field: string; message: string }[] = [];

    // Check email uniqueness
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      conflicts.push({ field: 'email', message: 'Email already exists' });
    }

    // Check username uniqueness (if provided)
    if (createUserDto.username) {
      const existingUsername = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });
      if (existingUsername) {
        conflicts.push({
          field: 'username',
          message: 'Username already exists',
        });
      }
    }

    // Check CNIC uniqueness (if provided)
    if (createUserDto.cnic) {
      const existingCnic = await this.userRepository.findOne({
        where: { cnic: createUserDto.cnic },
      });
      if (existingCnic) {
        conflicts.push({ field: 'cnic', message: 'CNIC already exists' });
      }
    }

    // If any conflicts found, return structured error
    if (conflicts.length > 0) {
      throw new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        message:
          conflicts.length === 1
            ? conflicts[0].message
            : 'Multiple fields have conflicts',
        errors: conflicts,
      });
    }

    try {
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
    } catch (error) {
      // Catch any database errors and convert to meaningful messages
      if (error.code === '23505') {
        // PostgreSQL unique violation
        const field = error.detail?.match(/\((.+?)\)/)?.[1] || 'field';
        throw new ConflictException({
          statusCode: 409,
          error: 'Conflict',
          message: `${field} already exists`,
          errors: [{ field, message: `${field} already exists` }],
        });
      }
      throw error;
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    updatedBy: number,
  ) {
    const user = await this.getUserById(id);
    const conflicts: { field: string; message: string }[] = [];

    // Check email uniqueness (excluding current user)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email, id: Not(id) },
      });
      if (existingEmail) {
        conflicts.push({ field: 'email', message: 'Email already exists' });
      }
    }

    // Check username uniqueness (excluding current user)
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username, id: Not(id) },
      });
      if (existingUsername) {
        conflicts.push({
          field: 'username',
          message: 'Username already exists',
        });
      }
    }

    // Check CNIC uniqueness (excluding current user)
    if (updateUserDto.cnic && updateUserDto.cnic !== user.cnic) {
      const existingCnic = await this.userRepository.findOne({
        where: { cnic: updateUserDto.cnic, id: Not(id) },
      });
      if (existingCnic) {
        conflicts.push({ field: 'cnic', message: 'CNIC already exists' });
      }
    }

    // If any conflicts found, return structured error
    if (conflicts.length > 0) {
      throw new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        message:
          conflicts.length === 1
            ? conflicts[0].message
            : 'Multiple fields have conflicts',
        errors: conflicts,
      });
    }

    try {
      // Store old values for audit
      const oldValues = {
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        email: user.email,
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
    } catch (error) {
      // Catch any database errors and convert to meaningful messages
      if (error.code === '23505') {
        // PostgreSQL unique violation
        const field = error.detail?.match(/\((.+?)\)/)?.[1] || 'field';
        throw new ConflictException({
          statusCode: 409,
          error: 'Conflict',
          message: `${field} already exists`,
          errors: [{ field, message: `${field} already exists` }],
        });
      }
      throw error;
    }
  }

  async changeUserPassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
    changedBy: number,
  ) {
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

  async hardDeleteUser(id: number, deletedBy: number) {
    // Find user without the isDeleted filter
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Save user data for audit log before deletion
    const userData = { ...user };

    // Permanently delete the user from the database
    await this.userRepository.delete(id);

    await this.createAuditLog({
      userId: deletedBy,
      action: 'DELETE_USER',
      entityType: 'user',
      entityId: id.toString(),
      oldValues: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
      newValues: null,
    });

    return { message: 'User permanently deleted' };
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
