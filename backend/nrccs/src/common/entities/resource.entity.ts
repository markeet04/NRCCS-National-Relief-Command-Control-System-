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

export enum ResourceType {
  FOOD = 'food',
  WATER = 'water',
  MEDICAL = 'medical',
  SHELTER = 'shelter',
  CLOTHING = 'clothing',
  BLANKET = 'blanket',
  TRANSPORT = 'transport',
  COMMUNICATION = 'communication',
  EQUIPMENT = 'equipment',
  PERSONNEL = 'personnel',
  OTHER = 'other',
}

export enum ResourceStatus {
  AVAILABLE = 'available',
  ALLOCATED = 'allocated',
  LOW = 'low',
  CRITICAL = 'critical',
  MAINTENANCE = 'maintenance',
  DEPLOYED = 'deployed',
}

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'resource_type' })
  resourceType: string;

  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ name: 'province_id', nullable: true })
  provinceId: number;

  @ManyToOne(() => Province, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'province_id' })
  provinceRelation: Province;

  @Column({ type: 'varchar', length: 100, nullable: true })
  province: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @ManyToOne(() => District, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'district_id' })
  districtRelation: District;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.AVAILABLE,
  })
  status: ResourceStatus;

  @Column({ type: 'integer', default: 0 })
  allocated: number;

  @Column({ type: 'integer', default: 0, name: 'allocated_quantity' })
  allocatedQuantity: number;

  @Column({ type: 'integer', default: 0 })
  trend: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, name: 'trend_percentage' })
  trendPercentage: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'contact_email' })
  contactEmail: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'last_update' })
  lastUpdate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
