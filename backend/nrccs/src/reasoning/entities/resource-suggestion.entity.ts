import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Province } from '../../common/entities/province.entity';
import { User } from '../../common/entities/user.entity';
import { NdmaResourceAllocation } from '../../common/entities/ndma-resource-allocation.entity';

export enum SuggestionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ExecutionStatus {
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('resource_suggestions')
export class ResourceSuggestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'suggestion_type', type: 'varchar', length: 50 })
  suggestionType: string;

  @Column({ name: 'province_id' })
  provinceId: number;

  @ManyToOne(() => Province)
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @Column({ name: 'resource_type', type: 'varchar', length: 50 })
  resourceType: string;

  @Column({ name: 'suggested_quantity', type: 'integer' })
  suggestedQuantity: number;

  @Column({ type: 'text' })
  reasoning: string;

  @Column({ name: 'rule_ids', type: 'text', array: true })
  ruleIds: string[];

  @Column({
    name: 'confidence_score',
    type: 'decimal',
    precision: 4,
    scale: 3,
    nullable: true,
  })
  confidenceScore: number;

  @Column({ name: 'ml_prediction_data', type: 'jsonb', nullable: true })
  mlPredictionData: any;

  @Column({
    type: 'enum',
    enum: SuggestionStatus,
    default: SuggestionStatus.PENDING,
  })
  status: SuggestionStatus;

  @Column({ type: 'text', array: true, nullable: true })
  flags: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedBy: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({
    name: 'execution_status',
    type: 'enum',
    enum: ExecutionStatus,
    nullable: true,
  })
  executionStatus: ExecutionStatus;

  @Column({ name: 'allocation_id', nullable: true })
  allocationId: number;

  @ManyToOne(() => NdmaResourceAllocation, { nullable: true })
  @JoinColumn({ name: 'allocation_id' })
  allocation: NdmaResourceAllocation;
}
