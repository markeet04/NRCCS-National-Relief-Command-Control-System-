import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { District } from './district.entity';

@Entity('weather_data')
export class WeatherData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'district_id', unique: true })
  districtId: number;

  @ManyToOne(() => District, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @Column({ type: 'varchar', length: 100, nullable: true })
  conditions: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  temperature: string;

  @Column({ type: 'text', nullable: true })
  forecast: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  humidity: string;

  @Column({ type: 'integer', nullable: true, name: 'humidity_value' })
  humidityValue: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'wind_speed' })
  windSpeed: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  rainfall: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'last_updated' })
  lastUpdated: Date;
}
