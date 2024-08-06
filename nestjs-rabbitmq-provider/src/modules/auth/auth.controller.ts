import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signIn.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';

@Controller('/v1/auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<any> {
    try {
      const result = await this.authService.signIn(signInDto);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          errorCode: HttpStatusCode.InternalServerError,
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
