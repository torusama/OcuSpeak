import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { DeviceType } from '../entities/device.entity';

export class RegisterDeviceDto {
  @ApiProperty({ example: 'iPad của bé An' })
  @IsString()
  deviceName: string;

  @ApiPropertyOptional({ enum: DeviceType, default: DeviceType.PATIENT_WEB })
  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;

  @ApiProperty({ description: 'Hồ sơ trẻ mà thiết bị này sẽ ghép đôi' })
  @IsUUID()
  childId: string;
}
