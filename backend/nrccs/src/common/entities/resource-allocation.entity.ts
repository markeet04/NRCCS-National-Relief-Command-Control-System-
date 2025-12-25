import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Resource } from './resource.entity';
import { District } from './district.entity';
import { Shelter } from './shelter.entity';
import { User } from './user.entity';

@Entity('resource_allocations')
export class ResourceAllocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resource_id' })
  resourceId: number;

  @ManyToOne(() => Resource, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;

  @Column({ name: 'allocated_to_district_id', nullable: true })
  allocatedToDistrictId: number;

  @ManyToOne(() => District, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'allocated_to_district_id' })
  allocatedToDistrict: District;

  @Column({ name: 'allocated_to_shelter_id', nullable: true })
  allocatedToShelterId: number;

  @ManyToOne(() => Shelter, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'allocated_to_shelter_id' })
  allocatedToShelter: Shelter;

  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ name: 'allocated_by', nullable: true })
  allocatedBy: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'allocated_by' })
  allocatedByUser: User;

  @CreateDateColumn({ name: 'allocated_at' })
  allocatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'returned_at' })
  returnedAt: Date;
}
