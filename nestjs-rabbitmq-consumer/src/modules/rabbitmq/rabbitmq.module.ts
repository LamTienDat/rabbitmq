import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { WeatherData } from '../weather/entity/weather.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherData])],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
