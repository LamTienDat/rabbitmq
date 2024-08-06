import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './modules/rabbitmq/rabbitmq.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [RabbitMQModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
