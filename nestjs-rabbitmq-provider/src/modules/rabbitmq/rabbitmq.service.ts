import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { RABBITMQ_HOST, RABBITMQ_PORT } from 'src/config/config';
import { InputDataDto } from './dtos/inputData.dto';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: amqp.ChannelWrapper;

  async onModuleInit() {
    const connect = `amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`;
    this.connection = amqp.connect([connect]);

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel) => channel.assertQueue('data_queue', { durable: true }),
    });

    this.channelWrapper.on('connect', () =>
      console.log('Connected to RabbitMQ'),
    );
    this.channelWrapper.on('error', (err, { name }) =>
      console.error(`Connection error: ${name}, error: ${err.message}`),
    );
  }

  async onModuleDestroy() {
    await this.connection.close();
  }

  async sendToQueue(data: InputDataDto) {
    this.channelWrapper.sendToQueue('data_queue', data, {
      persistent: true,
    } as any);
  }
}
