import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DateAudit } from 'src/base/dtos/base.dto';
import { RoleEnum } from 'src/enum/role.enum';

export class UserDetail extends DateAudit {
  @ApiProperty({ type: String, example: '@gmail.com', required: true })
  email: string;

  @IsEnum(RoleEnum)
  @ApiProperty({ type: String, enum: RoleEnum })
  role: string;
}
