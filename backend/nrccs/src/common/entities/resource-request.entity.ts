import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { District } from './district.entity';
import { User } from './user.entity';

export enum ResourceRequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    PARTIALLY_APPROVED = 'partially_approved',
    FULFILLED = 'fulfilled',
}

export enum ResourceRequestPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

@Entity('resource_requests')
export class ResourceRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'province_id', nullable: true })
    provinceId: number;

    @ManyToOne(() => Province, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'province_id' })
    province: Province;

    @Column({ name: 'district_id', nullable: true })
    districtId: number;

    @ManyToOne(() => District, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'district_id' })
    district: District;

    @Column({ name: 'requested_by_user_id', nullable: true })
    requestedByUserId: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'requested_by_user_id' })
    requestedByUser: User;

    @Column({ name: 'requested_by_name', length: 150, nullable: true })
    requestedByName: string;

    @Column({
        type: 'enum',
        enum: ResourceRequestStatus,
        default: ResourceRequestStatus.PENDING,
    })
    status: ResourceRequestStatus;

    @Column({
        type: 'enum',
        enum: ResourceRequestPriority,
        default: ResourceRequestPriority.MEDIUM,
    })
    priority: ResourceRequestPriority;

    @Column({ type: 'text', nullable: true })
    reason: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'jsonb', default: '[]', name: 'requested_items' })
    requestedItems: any[];

    @Column({ type: 'jsonb', default: '[]', name: 'approved_items' })
    approvedItems: any[];

    @Column({ name: 'processed_by_user_id', nullable: true })
    processedByUserId: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'processed_by_user_id' })
    processedByUser: User;

    @Column({ name: 'processed_by_name', length: 150, nullable: true })
    processedByName: string;

    @Column({ type: 'timestamptz', nullable: true, name: 'processed_at' })
    processedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
