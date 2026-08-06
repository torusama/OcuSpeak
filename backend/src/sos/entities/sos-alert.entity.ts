import { Entity, Column, ManyToOne, Index } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { ChildProfile } from '../../child/entities/child.entity';
import { Device } from '../../device/entities/device.entity';

export enum SosStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
}

@Entity('sos_alerts')
export class SosAlert extends BaseEntity {
  @Index()
  @ManyToOne(() => ChildProfile, { onDelete: 'CASCADE' })
  child: ChildProfile;

  @ManyToOne(() => Device, { nullable: true, onDelete: 'SET NULL' })
  device: Device;

  @Column({ type: 'enum', enum: SosStatus, default: SosStatus.ACTIVE })
  status: SosStatus;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;
}
