import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserSession } from './user-session.entity';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  NDMA = 'ndma',
  PDMA = 'pdma',
  DISTRICT = 'district',
  CIVILIAN = 'civilian',
}

export enum UserLevel {
  NATIONAL = 'National',
  PROVINCIAL = 'Provincial',
  DISTRICT = 'District',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CIVILIAN,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserLevel,
    nullable: true,
  })
  level: UserLevel;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  cnic: string;

  @Column({ type: 'text', nullable: true, name: 'avatar_url' })
  avatarUrl: string;

  @Column({ type: 'int', nullable: true, name: 'province_id' })
  provinceId: number;

  @Column({ type: 'int', nullable: true, name: 'district_id' })
  districtId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'text', array: true, nullable: true })
  permissions: string[];

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_login' })
  lastLogin: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @Column({ type: 'boolean', default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserSession, session => session.user)
  sessions: UserSession[];
}
