import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'setting_key' })
  settingKey: string;

  @Column({ type: 'text', nullable: true, name: 'setting_value' })
  settingValue: string;

  @Column({ type: 'varchar', length: 100, default: 'NRCCS', name: 'system_name' })
  systemName: string;

  @Column({ type: 'varchar', length: 20, default: 'normal', name: 'alert_level' })
  alertLevel: string;

  @Column({ type: 'varchar', length: 10, default: '30', name: 'session_timeout' })
  sessionTimeout: string;

  @Column({ type: 'boolean', default: true, name: 'auto_backup' })
  autoBackup: boolean;

  @Column({ type: 'boolean', default: false, name: 'maintenance_mode' })
  maintenanceMode: boolean;

  @Column({ type: 'varchar', length: 50, default: 'Connected', name: 'db_status' })
  dbStatus: string;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
