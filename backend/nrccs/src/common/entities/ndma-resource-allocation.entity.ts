import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { Resource } from './resource.entity';
import { ResourceRequest } from './resource-request.entity';
import { User } from './user.entity';

export enum NdmaAllocationStatus {
    PENDING = 'pending',
    IN_TRANSIT = 'in_transit',
    DELIVERED = 'delivered',
    RECEIVED = 'received',
    CANCELLED = 'cancelled',
}

@Entity('ndma_resource_allocations')
export class NdmaResourceAllocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'resource_id', nullable: true })
    resourceId: number;

    @ManyToOne(() => Resource, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'resource_id' })
    resource: Resource;

    @Column({ name: 'resource_type', length: 50 })
    resourceType: string;

    @Column({ name: 'resource_name', length: 200 })
    resourceName: string;

    @Column({ name: 'province_id' })
    provinceId: number;

    @ManyToOne(() => Province, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'province_id' })
    province: Province;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    unit: string;

    @Column({
        type: 'enum',
        enum: NdmaAllocationStatus,
        default: NdmaAllocationStatus.PENDING,
    })
    status: NdmaAllocationStatus;

    @Column({ type: 'varchar', length: 20, default: 'normal' })
    priority: string;

    @Column({ type: 'text', nullable: true })
    purpose: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'request_id', nullable: true })
    requestId: number;

    @ManyToOne(() => ResourceRequest, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'request_id' })
    request: ResourceRequest;

    @Column({ name: 'allocated_by_user_id', nullable: true })
    allocatedByUserId: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'allocated_by_user_id' })
    allocatedByUser: User;

    @Column({ name: 'allocated_by_name', length: 150, nullable: true })
    allocatedByName: string;

    @CreateDateColumn({ name: 'allocated_at' })
    allocatedAt: Date;

    @Column({ type: 'timestamptz', nullable: true, name: 'received_at' })
    receivedAt: Date;

    @Column({ name: 'received_by_user_id', nullable: true })
    receivedByUserId: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'received_by_user_id' })
    receivedByUser: User;

    @Column({ name: 'received_by_name', length: 150, nullable: true })
    receivedByName: string;
}
