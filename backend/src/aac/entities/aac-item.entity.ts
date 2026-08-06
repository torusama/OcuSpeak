import { Entity, Column, ManyToOne, Index } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { ChildProfile } from '../../child/entities/child.entity';

export enum AacCategory {
  NEED = 'NEED',
  FEELING = 'FEELING',
  PAIN = 'PAIN',
  SOCIAL = 'SOCIAL',
  ACTIVITY = 'ACTIVITY',
  CUSTOM = 'CUSTOM',
}

@Entity('aac_items')
export class AacItem extends BaseEntity {
  @Column()
  label: string;

  @Column({ type: 'enum', enum: AacCategory, default: AacCategory.NEED })
  category: AacCategory;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  quickSentence: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Index()
  @ManyToOne(() => ChildProfile, { onDelete: 'CASCADE' })
  child: ChildProfile;
}
