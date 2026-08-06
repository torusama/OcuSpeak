import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsUUID } from 'class-validator';
import { MonitoringType } from '../entities/monitoring-record.entity';

export class CreateMonitoringRecordDto {
  @ApiProperty()
  @IsUUID()
  childId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  deviceId?: string;

  @ApiProperty({ enum: MonitoringType })
  @IsEnum(MonitoringType)
  type: MonitoringType;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
