import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { District } from './district.entity';
import { User } from './user.entity';

export enum DamageReportStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
}

@Entity('damage_reports')
export class DamageReport {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({ type: 'text' })
  location: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @ManyToOne(() => District, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
    name: 'submitted_by',
  })
  submittedBy: string;

  @Column({ name: 'submitted_by_user_id', nullable: true })
  submittedByUserId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'submitted_by_user_id' })
  submittedByUser: User;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'report_date' })
  reportDate: Date;

  @Column({
    type: 'enum',
    enum: DamageReportStatus,
    default: DamageReportStatus.PENDING,
  })
  status: DamageReportStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'verified_by', nullable: true })
  verifiedBy: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'verified_by' })
  verifiedByUser: User;

  @Column({ type: 'timestamptz', nullable: true, name: 'verified_at' })
  verifiedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
