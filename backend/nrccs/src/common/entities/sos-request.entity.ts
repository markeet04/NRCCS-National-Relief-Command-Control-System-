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
import { User } from './user.entity';
import { RescueTeam } from './rescue-team.entity';

export enum SosStatus {
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
  EN_ROUTE = 'En-route',
  IN_PROGRESS = 'In Progress',
  RESCUED = 'Rescued',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum SosPriority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

@Entity('sos_requests')
export class SosRequest {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'requester_name' })
  requesterName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  cnic: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true, name: 'location_address' })
  locationAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true, name: 'location_lat' })
  locationLat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true, name: 'location_lng' })
  locationLng: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  coordinates: string;

  @Column({ type: 'integer', default: 1, name: 'people_count' })
  peopleCount: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'emergency_type' })
  emergencyType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: SosStatus,
    default: SosStatus.PENDING,
  })
  status: SosStatus;

  @Column({
    type: 'enum',
    enum: SosPriority,
    default: SosPriority.MEDIUM,
  })
  priority: SosPriority;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'assigned_team' })
  assignedTeam: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'assigned_team_id' })
  assignedTeamId: string;

  @ManyToOne(() => RescueTeam, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_team_id' })
  rescueTeam: RescueTeam;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @ManyToOne(() => District, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'estimated_arrival' })
  estimatedArrival: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'estimated_response_time' })
  estimatedResponseTime: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'distance_away' })
  distanceAway: string;

  @Column({ type: 'integer', default: 0, name: 'current_stage' })
  currentStage: number;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'contact_phone' })
  contactPhone: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'emergency_line' })
  emergencyLine: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'team_leader' })
  teamLeader: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  investigator: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'response_team' })
  responseTeam: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'team_contact' })
  teamContact: string;

  @Column({ name: 'submitted_by', nullable: true })
  submittedBy: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'submitted_by' })
  submittedByUser: User;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'submitted_by_name' })
  submittedByName: string;

  @Column({ type: 'varchar', length: 15, nullable: true, name: 'submitted_by_cnic' })
  submittedByCnic: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'submitted_by_phone' })
  submittedByPhone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  time: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'submitted_at' })
  submittedAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'completed_at' })
  completedAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @Column({ type: 'boolean', default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
