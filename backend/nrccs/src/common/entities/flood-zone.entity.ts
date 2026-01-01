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

export enum FloodZoneLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  STABLE = 'stable',
  LOW = 'low',
}

@Entity('flood_zones')
export class FloodZone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({
    type: 'enum',
    enum: FloodZoneLevel,
    default: FloodZoneLevel.MEDIUM,
    name: 'risk_level',
  })
  riskLevel: FloodZoneLevel;

  // Location coordinates
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  lng: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'integer', default: 0, name: 'affected_population' })
  affectedPopulation: number;

  @Column({ type: 'integer', default: 0, name: 'shelter_count' })
  shelterCount: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @ManyToOne(() => District, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @Column({ type: 'jsonb', nullable: true, name: 'polygon_coordinates' })
  polygonCoordinates: object;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_assessment' })
  lastAssessment: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
