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
import { User } from './user.entity';

export enum MissingPersonStatus {
  ACTIVE = 'active', // Still missing
  FOUND = 'found', // Found alive
  DEAD = 'dead', // Declared dead (20+ days or confirmed)
  SEARCHING = 'searching',
  CLOSED = 'closed',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

@Entity('missing_persons')
export class MissingPerson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true, name: 'case_number' })
  caseNumber: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'case_reference',
  })
  caseReference: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'integer', nullable: true })
  age: number;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ type: 'text', nullable: true, name: 'last_seen_location' })
  lastSeenLocation: string;

  @Column({ type: 'date', nullable: true, name: 'last_seen_date' })
  lastSeenDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true, name: 'photo_url' })
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  photo: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
    name: 'reporter_name',
  })
  reporterName: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'reporter_phone',
  })
  reporterPhone: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'contact_number',
  })
  contactNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'reported_by' })
  reportedBy: string;

  @Column({
    type: 'enum',
    enum: MissingPersonStatus,
    default: MissingPersonStatus.ACTIVE,
  })
  status: MissingPersonStatus;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @ManyToOne(() => District, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @Column({ name: 'reported_by_user_id', nullable: true })
  reportedByUserId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reported_by_user_id' })
  reportedByUser: User;

  @Column({ type: 'timestamptz', nullable: true, name: 'found_at' })
  foundAt: Date;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'report_date' })
  reportDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
