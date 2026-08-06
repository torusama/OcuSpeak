import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { Caregiver } from './caregiver.entity';
import { Device } from './device.entity';

@Entity('children')
export class ChildProfile extends BaseEntity {

  @Column()
  fullName: string;

  @Column({
    type: 'date',
  })
  birthday: Date;

  @Column()
  gender: string;

  @Column({
    nullable: true,
  })
  diagnosis: string;

  @Column({
    default: 'vi',
  })
  language: string;

  @ManyToOne(() => Caregiver, caregiver => caregiver.children)
  caregiver: Caregiver;

  @OneToMany(() => Device, device => device.child)
  devices: Device[];
}