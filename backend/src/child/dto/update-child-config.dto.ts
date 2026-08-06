import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsNumber, Max, Min } from 'class-validator';
import { AacGridSize, AacImageStyle, AacResponseType } from '../entities/child-config.entity';

export class UpdateChildConfigDto {
  @ApiPropertyOptional({ enum: AacGridSize })
  @IsOptional()
  @IsEnum(AacGridSize)
  gridSize?: AacGridSize;

  @ApiPropertyOptional({ example: 1200, description: 'Thời gian nhìn giữ (dwell) tính bằng ms' })
  @IsOptional()
  @IsInt()
  @Min(200)
  @Max(10000)
  dwellTimeMs?: number;

  @ApiPropertyOptional({ enum: AacImageStyle })
  @IsOptional()
  @IsEnum(AacImageStyle)
  imageStyle?: AacImageStyle;

  @ApiPropertyOptional({ enum: AacResponseType })
  @IsOptional()
  @IsEnum(AacResponseType)
  responseType?: AacResponseType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  voiceOutputEnabled?: boolean;

  @ApiPropertyOptional({ example: 1.0 })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(2)
  speechRate?: number;
}
