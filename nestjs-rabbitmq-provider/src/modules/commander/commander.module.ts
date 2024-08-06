import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from 'src/config/app.config';
import { DatabaseModule } from 'src/database/database.module';
import { UserCommander } from './user.commander';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
    }),
    forwardRef(() => DatabaseModule),
  ],
  providers: [UserCommander],
})
export class CommanderModule {}
