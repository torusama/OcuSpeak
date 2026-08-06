import { Entity, Column, ManyToOne, Index } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { ChildProfile } from '../../child/entities/child.entity';

export enum DeviceType {
  PATIENT_WEB = 'PATIENT_WEB',
  TABLET = 'TABLET',
}

@Entity('devices')
export class Device extends BaseEntity {
  @Column()
  deviceName: string;

  @Column({ type: 'enum', enum: DeviceType, default: DeviceType.PATIENT_WEB })
  deviceType: DeviceType;

  @Index({ unique: true })
  @Column({ nullable: true })
  pairingCode: string;

  @Column({ type: 'timestamp', nullable: true })
  pairingCodeExpiresAt: Date;

  @Column({ default: false })
  paired: boolean;

  @Column({ default: false })
  online: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSeenAt: Date;

  @ManyToOne(() => ChildProfile, (child) => child.devices, { nullable: true, onDelete: 'SET NULL' })
  child: ChildProfile;
}
