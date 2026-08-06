import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString, IsUUID } from 'class-validator';

export class CreateCommunicationEventDto {
  @ApiProperty()
  @IsUUID()
  childId: string;

  @ApiProperty({ type: [String], example: ['item-water', 'item-please'] })
  @IsArray()
  @ArrayNotEmpty()
  itemIds: string[];

  @ApiProperty({ example: 'Con muốn uống nước ạ' })
  @IsString()
  sentence: string;
}
