import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ResponseType } from '../entities/caregiver-response.entity';

export class CreateCaregiverResponseDto {
  @ApiPropertyOptional({ enum: ResponseType, default: ResponseType.TEXT })
  @IsOptional()
  @IsEnum(ResponseType)
  type?: ResponseType;

  @ApiProperty({ example: 'Mẹ mang nước cho con ngay đây' })
  @IsString()
  content: string;
}
