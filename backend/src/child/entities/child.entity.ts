import { Entity, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { Caregiver } from '../../caregiver/entities/caregiver.entity';
import { Device } from '../../device/entities/device.entity';
import { ChildConfig } from './child-config.entity';

@Entity('children')
export class ChildProfile extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column()
  gender: string;

  @Column({ nullable: true })
  diagnosis: string;

  @Column({ default: 'vi' })
  language: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => Caregiver, (caregiver) => caregiver.children, {
    onDelete: 'CASCADE',
  })
  caregiver: Caregiver;

  @OneToMany(() => Device, (device) => device.child)
  devices: Device[];

  @OneToOne(() => ChildConfig, (config) => config.child, { cascade: true })
  config: ChildConfig;
}

// Backward-compatible alias used by earlier scaffolding.
export { ChildProfile as Child };
