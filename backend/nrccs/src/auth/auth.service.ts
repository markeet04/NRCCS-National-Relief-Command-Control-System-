import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../common/entities/user.entity';
import { UserSession } from '../common/entities/user-session.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private sessionRepository: Repository<UserSession>,
  ) {}

  /**
   * Validate user credentials (used by LocalStrategy)
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

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      level: user.level,
      provinceId: user.provinceId,
      districtId: user.districtId,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isDeleted: false, isActive: true },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      level: user.level,
      provinceId: user.provinceId,
      districtId: user.districtId,
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

  async createSession(userId: number, ipAddress: string, userAgent: string): Promise<UserSession> {
    // Generate token hash
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
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
