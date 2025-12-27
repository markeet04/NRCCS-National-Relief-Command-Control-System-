import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { District } from './district.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code: string;

  @Column({ type: 'integer', default: 0, name: 'district_count' })
  districtCount: number;

  @Column({ type: 'integer', default: 0, name: 'flood_history_count' })
  floodHistoryCount: number;

  @Column({ type: 'timestamp', nullable: true, name: 'last_flood_date' })
  lastFloodDate: Date;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
