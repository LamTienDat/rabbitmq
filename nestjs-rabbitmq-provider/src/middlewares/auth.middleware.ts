import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization?.split(' ')[1];

    if (!authToken) {
      throw new HttpException(
        { errorCode: HttpStatus.UNAUTHORIZED, errorMessage: 'Unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    next();
  }
}
