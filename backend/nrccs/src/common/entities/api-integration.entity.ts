import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('api_integrations')
export class ApiIntegration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'api_key' })
  apiKey: string;

  @Column({ type: 'text', nullable: true })
  endpoint: string;

  @Column({ type: 'text', nullable: true, name: 'endpoint_url' })
  endpointUrl: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_sync' })
  lastSync: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_tested' })
  lastTested: Date;

  @Column({ type: 'jsonb', nullable: true })
  config: any;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
