import { Entity, Column, ManyToOne, Index } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { Caregiver } from '../../caregiver/entities/caregiver.entity';
import { CommunicationEvent } from './communication-event.entity';

export enum ResponseType {
  TEXT = 'TEXT',
  QUICK_REACTION = 'QUICK_REACTION',
  VOICE_NOTE = 'VOICE_NOTE',
}

@Entity('caregiver_responses')
export class CaregiverResponse extends BaseEntity {
  @Index()
  @ManyToOne(() => CommunicationEvent, (event) => event.responses, { onDelete: 'CASCADE' })
  event: CommunicationEvent;

  @ManyToOne(() => Caregiver, { onDelete: 'CASCADE' })
  caregiver: Caregiver;

  @Column({ type: 'enum', enum: ResponseType, default: ResponseType.TEXT })
  type: ResponseType;

  @Column()
  content: string;

  @Column({ default: false })
  delivered: boolean;
}
