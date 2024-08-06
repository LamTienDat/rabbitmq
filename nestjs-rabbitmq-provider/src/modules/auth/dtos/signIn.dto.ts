import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class SignInDto {
  @ApiProperty({ type: String, example: '@gmail.com', required: true })
  email: string;

  @ApiProperty({ type: String, example: 'password', required: true })
  password: string;
}
