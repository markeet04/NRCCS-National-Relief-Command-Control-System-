import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { District } from './district.entity';

export enum ShelterStatus {
  AVAILABLE = 'available',
  LIMITED = 'limited',
  FULL = 'full',
  OPERATIONAL = 'operational',
  CLOSED = 'closed',
}

@Entity('shelters')
export class Shelter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @ManyToOne(() => District, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  lng: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  distance: number;

  @Column({ type: 'integer', default: 0 })
  capacity: number;

  @Column({ type: 'integer', default: 0 })
  occupancy: number;

  @Column({
    type: 'enum',
    enum: ShelterStatus,
    default: ShelterStatus.AVAILABLE,
  })
  status: ShelterStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'contact_phone' })
  contactPhone: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'manager_name' })
  managerName: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'manager_phone' })
  managerPhone: string;

  @Column({ type: 'text', array: true, nullable: true })
  facilities: string[];

  @Column({ type: 'text', array: true, nullable: true })
  amenities: string[];

  @Column({ type: 'integer', default: 100, name: 'supply_food' })
  supplyFood: number;

  @Column({ type: 'integer', default: 100, name: 'supply_water' })
  supplyWater: number;

  @Column({ type: 'integer', default: 100, name: 'supply_medical' })
  supplyMedical: number;

  @Column({ type: 'integer', default: 100, name: 'supply_tents' })
  supplyTents: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ type: 'text', array: true, nullable: true, name: 'critical_needs' })
  criticalNeeds: string[];

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @Column({ type: 'boolean', default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'last_update' })
  lastUpdate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
