import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { AacCategory } from '../entities/aac-item.entity';

export class CreateAacItemDto {
  @ApiProperty({ example: 'Con muốn uống nước' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ enum: AacCategory, default: AacCategory.NEED })
  @IsOptional()
  @IsEnum(AacCategory)
  category?: AacCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'Con muốn uống nước ạ' })
  @IsString()
  quickSentence: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty()
  @IsUUID()
  childId: string;
}
