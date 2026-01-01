import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { District } from './district.entity';

export enum RescueTeamStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  DEPLOYED = 'deployed',
  ON_MISSION = 'on-mission',
  UNAVAILABLE = 'unavailable',
  RESTING = 'resting',
}

export enum RescueTeamType {
  RESCUE_1122 = 'Rescue 1122',
  MEDICAL_RESPONSE = 'Medical Response',
  CIVIL_DEFENSE = 'Civil Defense',
  ARMY = 'Army',
  NAVY = 'Navy',
  OTHER = 'Other',
}

@Entity('rescue_teams')
export class RescueTeam {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'team_type' })
  teamType: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  leader: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'leader_name' })
  leaderName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'contact_phone',
  })
  contactPhone: string;

  @Column({ type: 'integer', default: 0 })
  members: number;

  @Column({ type: 'integer', default: 0, name: 'member_count' })
  memberCount: number;

  @Column({
    type: 'enum',
    enum: RescueTeamStatus,
    default: RescueTeamStatus.AVAILABLE,
  })
  status: RescueTeamStatus;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @ManyToOne(() => District, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'current_location',
  })
  currentLocation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  coordinates: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
    name: 'location_lat',
  })
  locationLat: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
    name: 'location_lng',
  })
  locationLng: number;

  @Column({ type: 'text', array: true, nullable: true })
  equipment: string[];

  @Column({ type: 'integer', default: 0, name: 'composition_medical' })
  compositionMedical: number;

  @Column({ type: 'integer', default: 0, name: 'composition_rescue' })
  compositionRescue: number;

  @Column({ type: 'integer', default: 0, name: 'composition_support' })
  compositionSupport: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'current_mission_id',
  })
  currentMissionId: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @Column({ type: 'boolean', default: false, name: 'is_deleted' })
  isDeleted: boolean;

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
