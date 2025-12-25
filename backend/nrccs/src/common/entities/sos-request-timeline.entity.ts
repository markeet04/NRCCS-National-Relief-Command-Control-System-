import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SosRequest } from './sos-request.entity';

@Entity('sos_request_timeline')
export class SosRequestTimeline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, name: 'sos_request_id' })
  sosRequestId: string;

  @ManyToOne(() => SosRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sos_request_id' })
  sosRequest: SosRequest;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  time: string;

  @Column({ type: 'timestamptz', nullable: true })
  timestamp: Date;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
