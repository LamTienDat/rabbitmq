import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RoleEnum } from 'src/enum/role.enum';

export class UpdateUserDto {
  @ApiProperty({ type: String, example: '@gmail.com', required: true })
  email: string;

  @ApiProperty({ type: String, example: 'admin1', required: true })
  username: string;

  @ApiProperty({ type: String, example: 'string', required: false })
  password: string;

  @IsEnum(RoleEnum)
  @ApiProperty({ type: String, enum: RoleEnum })
  role: string;
}
