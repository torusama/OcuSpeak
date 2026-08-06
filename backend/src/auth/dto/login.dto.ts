import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'caregiver@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123' })
  @MinLength(6)
  password: string;
}
