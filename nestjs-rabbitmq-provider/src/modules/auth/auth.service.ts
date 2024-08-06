import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dtos/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<any> {
    try {
      const user = await this.usersService.findOneSignIn(signInDto.email);
      if (!user) {
        return {
          errorCode: HttpStatus.NOT_FOUND,
          errorMessage: 'user-not-found',
        };
      }

      const isPasswordValid = await bcrypt.compare(
        signInDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        return {
          errorCode: HttpStatus.UNAUTHORIZED,
          errorMessage: 'wrong-password',
        };
      }

      const { password, ...userWithoutPassword } = user;
      const payload = { ...userWithoutPassword };

      const access_token = await this.jwtService.signAsync(payload);
      return {
        statusCode: HttpStatus.OK,
        user: {
          deleted: user.deleted,
          email: user.email,
          role: user.role,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          access_token: access_token,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Error signing in');
    }
  }
}
