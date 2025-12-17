import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'activity_type' })
  activityType: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  severity: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'int', nullable: true, name: 'province_id' })
  provinceId: number;

  @Column({ type: 'int', nullable: true, name: 'district_id' })
  districtId: number;

  @Column({ type: 'int', nullable: true, name: 'performed_by' })
  performedBy: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'related_entity_type' })
  relatedEntityType: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'related_entity_id' })
  relatedEntityId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
