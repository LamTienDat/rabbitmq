import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DateAudit } from 'src/base/dtos/base.dto';
import { RoleEnum } from 'src/enum/role.enum';

export class CreateUserDto extends DateAudit {
  @ApiProperty({ type: String, example: '@gmail.com', required: true })
  email: string;

  @ApiProperty({ type: String, example: 'admin1', required: true })
  username: string;

  @ApiProperty({ type: String, example: 'password', required: true })
  password: string;
}
