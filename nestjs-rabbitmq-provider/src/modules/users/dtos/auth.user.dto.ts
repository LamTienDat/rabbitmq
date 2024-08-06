import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  role: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  _id: string;
}
