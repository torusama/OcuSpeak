import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSosAlertDto {
  @ApiProperty()
  @IsUUID()
  childId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  deviceId?: string;

  @ApiPropertyOptional({ example: 'Trẻ nhấn nút SOS 3 lần liên tiếp' })
  @IsOptional()
  @IsString()
  note?: string;
}
