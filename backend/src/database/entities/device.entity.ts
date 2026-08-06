import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { ChildProfile } from './child-profile.entity';

@Entity('devices')
export class Device extends BaseEntity {

  @Column()
  deviceName: string;

  @Column()
  deviceType: string;

  @Column({
    unique: true,
  })
  pairingCode: string;

  @Column({
    default: false,
  })
  online: boolean;

  @ManyToOne(() => ChildProfile, child => child.devices)
  child: ChildProfile;
}