import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class PairDeviceDto {
  @ApiProperty({ example: 'A1B2C3', description: 'Mã ghép đôi 6 ký tự' })
  @IsString()
  @Length(6, 6)
  code: string;
}
