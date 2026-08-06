import { Entity, Column, ManyToOne, Index } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { ChildProfile } from '../../child/entities/child.entity';
import { Device } from '../../device/entities/device.entity';

export enum MonitoringType {
  DEVICE_ONLINE = 'DEVICE_ONLINE',
  DEVICE_OFFLINE = 'DEVICE_OFFLINE',
  CALIBRATION = 'CALIBRATION',
  BATTERY_LOW = 'BATTERY_LOW',
  INACTIVITY = 'INACTIVITY',
  HEARTBEAT = 'HEARTBEAT',
}

@Entity('monitoring_records')
export class MonitoringRecord extends BaseEntity {
  @Index()
  @ManyToOne(() => ChildProfile, { onDelete: 'CASCADE' })
  child: ChildProfile;

  @ManyToOne(() => Device, { nullable: true, onDelete: 'SET NULL' })
  device: Device;

  @Column({ type: 'enum', enum: MonitoringType })
  type: MonitoringType;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown>;
}
