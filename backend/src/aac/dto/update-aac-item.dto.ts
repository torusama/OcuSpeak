import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAacItemDto } from './create-aac-item.dto';

export class UpdateAacItemDto extends PartialType(
  OmitType(CreateAacItemDto, ['childId'] as const),
) {}
