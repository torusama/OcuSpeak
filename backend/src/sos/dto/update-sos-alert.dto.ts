import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SosStatus } from '../entities/sos-alert.entity';

export class UpdateSosAlertDto {
  @ApiProperty({ enum: SosStatus })
  @IsEnum(SosStatus)
  status: SosStatus;
}
