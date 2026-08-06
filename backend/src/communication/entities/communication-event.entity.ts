import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { ChildProfile } from '../../child/entities/child.entity';
import { CaregiverResponse } from './caregiver-response.entity';

export enum CommunicationStatus {
  QUEUED_LOCAL = 'QUEUED_LOCAL',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  RESPONDED = 'RESPONDED',
}

@Entity('communication_events')
export class CommunicationEvent extends BaseEntity {
  @Index()
  @ManyToOne(() => ChildProfile, { onDelete: 'CASCADE' })
  child: ChildProfile;

  @Column('simple-array')
  itemIds: string[];

  @Column()
  sentence: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'enum', enum: CommunicationStatus, default: CommunicationStatus.SENT })
  status: CommunicationStatus;

  @Column({ default: true })
  unread: boolean;

  @OneToMany(() => CaregiverResponse, (response) => response.event, { cascade: true })
  responses: CaregiverResponse[];
}
