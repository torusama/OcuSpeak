import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChildDto {
  @ApiProperty({ example: 'Nguyễn Bảo An' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '2019-05-10' })
  @IsDateString()
  birthday: string;

  @ApiProperty({ example: 'female' })
  @IsString()
  gender: string;

  @ApiPropertyOptional({ example: 'Bại não thể co cứng' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'vi', default: 'vi' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'ID của caregiver sở hữu hồ sơ trẻ này' })
  @IsUUID()
  caregiverId: string;
}
