import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { District } from './district.entity';
import { User } from './user.entity';

export enum AlertType {
  FLOOD_WARNING = 'flood_warning',
  EVACUATION = 'evacuation',
  ALL_CLEAR = 'all_clear',
  FLOOD = 'flood',
  SHELTER = 'shelter',
  EARTHQUAKE = 'earthquake',
  STORM = 'storm',
  HEALTH = 'health',
  FIRE = 'fire',
  SECURITY = 'security',
  WEATHER = 'weather',
  OTHER = 'other',
}

export enum AlertSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

export enum AlertStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  RESOLVED = 'resolved',
  PENDING = 'pending',
  DRAFT = 'draft',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'alert_type' })
  alertType: string;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
    default: AlertSeverity.MEDIUM,
  })
  severity: AlertSeverity;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'short_description',
  })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'text', array: true, nullable: true, name: 'affected_areas' })
  affectedAreas: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    name: 'recommended_actions',
  })
  recommendedActions: string[];

  @Column({ name: 'province_id', nullable: true })
  provinceId: number;

  @ManyToOne(() => Province, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'province_id' })
  provinceRelation: Province;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @ManyToOne(() => District, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'district_id' })
  districtRelation: District;

  @Column({ type: 'varchar', length: 100, nullable: true })
  province: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  district: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tehsil: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  source: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'issued_by' })
  issuedBy: string;

  @Column({ name: 'issued_by_user_id', nullable: true })
  issuedByUserId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'issued_by_user_id' })
  issuedByUser: User;

  @Column({ type: 'varchar', length: 150, nullable: true })
  creator: string;

  @Column({
    type: 'enum',
    enum: AlertStatus,
    default: AlertStatus.ACTIVE,
  })
  status: AlertStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  color: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'display_color',
  })
  displayColor: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  time: Date;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'issued_at',
  })
  issuedAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'issue_date' })
  issueDate: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'expiry_date' })
  expiryDate: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'resolved_at' })
  resolvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
