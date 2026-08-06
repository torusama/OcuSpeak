import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { ChildProfile } from './child.entity';

export enum AacGridSize {
  GRID_2X2 = '2x2',
  GRID_3X3 = '3x3',
  GRID_4X4 = '4x4',
}

export enum AacImageStyle {
  PHOTO = 'PHOTO',
  ICON = 'ICON',
  SYMBOL = 'SYMBOL',
}

export enum AacResponseType {
  EYE_GAZE = 'EYE_GAZE',
  DWELL_CLICK = 'DWELL_CLICK',
  SWITCH = 'SWITCH',
  TOUCH = 'TOUCH',
}

@Entity('child_configs')
export class ChildConfig extends BaseEntity {
  @Column({ type: 'enum', enum: AacGridSize, default: AacGridSize.GRID_3X3 })
  gridSize: AacGridSize;

  @Column({ type: 'int', default: 1200 })
  dwellTimeMs: number;

  @Column({ type: 'enum', enum: AacImageStyle, default: AacImageStyle.SYMBOL })
  imageStyle: AacImageStyle;

  @Column({ type: 'enum', enum: AacResponseType, default: AacResponseType.EYE_GAZE })
  responseType: AacResponseType;

  @Column({ default: true })
  voiceOutputEnabled: boolean;

  @Column({ type: 'float', default: 1.0 })
  speechRate: number;

  @OneToOne(() => ChildProfile, (child) => child.config, { onDelete: 'CASCADE' })
  @JoinColumn()
  child: ChildProfile;
}
