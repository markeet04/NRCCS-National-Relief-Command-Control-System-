import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../common/entities/user.entity';
import { UserSession } from '../common/entities/user-session.entity';
import { Province } from '../common/entities/province.entity';
import { District } from '../common/entities/district.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private sessionRepository: Repository<UserSession>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  /**
   * Validate user credentials (used by LocalStrategy)
   * Returns user with province and district NAMES for frontend map scoping
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email, isDeleted: false },
    });

    if (!user) {
      return null;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Fetch province and district names for map scoping
    let provinceName: string | null = null;
    let districtName: string | null = null;

    if (user.provinceId) {
      const province = await this.provinceRepository.findOne({
        where: { id: user.provinceId },
      });
      provinceName = province?.name || null;
    }

    if (user.districtId) {
      const district = await this.districtRepository.findOne({
        where: { id: user.districtId },
      });
      districtName = district?.name || null;
    }

    // Return user with province and district NAMES for frontend map scoping
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      level: user.level,
      provinceId: user.provinceId,
      districtId: user.districtId,
      province: provinceName, // Province NAME for map scoping
      district: districtName, // District NAME for map scoping
    };
  }

  /**
   * Get user by ID (with province and district names for map scoping)
   */
  async getUserById(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isDeleted: false, isActive: true },
    });

    if (!user) {
      return null;
    }

    // Fetch province and district names for map scoping
    let provinceName: string | null = null;
    let districtName: string | null = null;

    if (user.provinceId) {
      const province = await this.provinceRepository.findOne({
        where: { id: user.provinceId },
      });
      provinceName = province?.name || null;
    }

    if (user.districtId) {
      const district = await this.districtRepository.findOne({
        where: { id: user.districtId },
      });
      districtName = district?.name || null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      level: user.level,
      provinceId: user.provinceId,
      districtId: user.districtId,
      province: provinceName,
      district: districtName,
    };
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      lastLogin: new Date(),
    });
  }

  async createSession(
    userId: number,
    ipAddress: string,
    userAgent: string,
  ): Promise<UserSession> {
    // Generate token hash
    const token =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    const tokenHash = await bcrypt.hash(token, 10);

    // Session expires in 24 hours (fix: add 24 hours using Date.now())
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const session = this.sessionRepository.create({
      userId,
      tokenHash,
      ipAddress,
      userAgent,
      expiresAt,
    });

    return await this.sessionRepository.save(session);
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.sessionRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
