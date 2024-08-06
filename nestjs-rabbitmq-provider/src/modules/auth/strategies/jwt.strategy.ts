import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { JWT_SECRET_KEY } from 'src/config/jwtConfig';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY || 'JWT_SECRET_KEY',
    });
  }

  async validate(payload: any) {
    return { id: payload._id, email: payload.email, role: payload.role };
  }
}
