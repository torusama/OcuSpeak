import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateChildDto {
  @IsString()
  fullName: string;

  @IsDateString()
  birthday: string;

  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsString()
  language: string;

  @IsUUID()
  caregiverId: string;
}