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

export enum DistrictRiskLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  STABLE = 'stable',
  LOW = 'low',
}

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'province_id' })
  provinceId: number;

  @ManyToOne(() => Province, (province) => province.districts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @Column({ type: 'integer', default: 0 })
  population: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({
    type: 'enum',
    enum: DistrictRiskLevel,
    default: DistrictRiskLevel.STABLE,
    name: 'risk_level',
  })
  riskLevel: DistrictRiskLevel;

  @Column({ type: 'varchar', length: 50, default: 'stable' })
  status: string;

  @Column({ type: 'integer', default: 0, name: 'active_teams' })
  activeTeams: number;

  @Column({ type: 'integer', default: 0, name: 'sos_requests' })
  sosRequests: number;

  @Column({ type: 'integer', default: 0, name: 'active_alerts' })
  activeAlerts: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_update',
  })
  lastUpdate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
