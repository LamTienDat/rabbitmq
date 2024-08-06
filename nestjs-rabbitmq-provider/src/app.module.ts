import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CommanderModule } from './modules/commander/commander.module';
import { DatabaseModule } from './database/database.module';
import { ExcludeRoutes } from './constants/rbac.constant';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { RabbitMQModule } from './modules/rabbitmq/rabbitmq.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CommanderModule,
    DatabaseModule,
    RabbitMQModule,
    ThrottlerModule.forRootAsync({
      useFactory: (): ThrottlerModuleOptions => {
        const throttlerOptions: unknown = {
          ttl: 60,
          limit: 100000,
        };
        return throttlerOptions as ThrottlerModuleOptions;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude(...ExcludeRoutes.map((route) => route.path))
      .forRoutes('*');
  }
}
