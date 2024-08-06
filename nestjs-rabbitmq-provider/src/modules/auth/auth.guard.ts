import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) return false;
    const token = request.headers.authorization.split('Bearer ')[1];
    const decode = jwt.decode(token);
    request.user = decode;
    return true;
  }
}
