import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';
import { RABBITMQ_HOST, RABBITMQ_PORT } from 'src/config/config';
import { WeatherData } from '../weather/entity/weather.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mutex } from 'async-mutex';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private batch: WeatherData[] = [];
  private readonly BATCH_SIZE = 200; // Kích thước của lô
  private readonly BATCH_INTERVAL = 5000; // Thời gian chờ (ms)
  private mutex = new Mutex();

  constructor(
    @InjectRepository(WeatherData)
    private readonly weatherRepository: Repository<WeatherData>,
  ) {}

  async onModuleInit() {
    const connect = `amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`;
    this.connection = amqp.connect([connect]);
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel) => {
        return channel.assertQueue('data_queue', { durable: true }).then(() => {
          return channel.consume(
            'data_queue',
            async (msg: ConsumeMessage | null) => {
              if (msg !== null) {
                let content = msg.content.toString();
                const data = JSON.parse(content);

                // Chuyển đổi dữ liệu về định dạng đúng
                const transformedData = this.transformData(data);

                // Kiểm tra dữ liệu có hợp lệ không
                if (this.isValidWeatherData(transformedData)) {
                  // Thêm dữ liệu vào bộ nhớ tạm
                  this.batch.push(transformedData);

                  // Kiểm tra xem bộ nhớ tạm đã đạt kích thước lô chưa
                  if (this.batch.length >= this.BATCH_SIZE) {
                    await this.saveBatch();
                  }
                } else {
                  console.log('Invalid data:', transformedData);
                }

                // Xác nhận việc xử lý tin nhắn
                channel.ack(msg);
              }
            },
          );
        });
      },
    });

    this.channelWrapper.on('connect', () => {
      console.log('Connected to RabbitMQ');
    });

    this.channelWrapper.on('error', (err, { name }) => {
      console.log(`Error: ${err.message}, name`);
    });

    // Thiết lập setInterval để lưu dữ liệu theo thời gian
    setInterval(async () => {
      if (this.batch.length > 0) {
        await this.saveBatch();
      }
    }, this.BATCH_INTERVAL);
  }

  async onModuleDestroy() {
    await this.connection.close();
  }

  private async saveBatch() {
    const release = await this.mutex.acquire();
    try {
      // const uniqueBatch = Array.from(
      //   new Map(this.batch.map((item) => [item.id, item])).values(),
      // );

      // Lưu dữ liệu vào cơ sở dữ liệu
      await this.weatherRepository
        .createQueryBuilder()
        .insert()
        .into(WeatherData)
        .values(this.batch)
        .onConflict(`("id") DO NOTHING`) // Hoặc sử dụng DO UPDATE SET ...
        .execute();

      console.log('Batch saved:', this.batch.length);

      // Xóa bộ nhớ tạm sau khi lưu
      this.batch = [];
    } catch (error) {
      console.error('Error saving batch:', error);
    } finally {
      release();
    }
  }

  private transformData(data: any): WeatherData {
    return {
      ...data,
      // Chuyển đổi các trường nếu cần thiết
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      temperature: parseFloat(data.temperature) || 0,
      humidity: parseFloat(data.humidity) || 0,
      windSpeed: parseFloat(data.windSpeed) || 0,
      pressure: parseFloat(data.pressure) || 0,
      precipitation: data.precipitation ? parseFloat(data.precipitation) : 0,
    };
  }

  private isValidWeatherData(data: any): data is WeatherData {
    return (
      data &&
      typeof data.city === 'string' &&
      typeof data.state === 'string' &&
      typeof data.country === 'string' &&
      data.timestamp instanceof Date &&
      !isNaN(data.timestamp.getTime()) &&
      typeof data.temperature === 'number' &&
      typeof data.humidity === 'number' &&
      typeof data.windSpeed === 'number' &&
      typeof data.weatherCondition === 'string' &&
      typeof data.pressure === 'number' &&
      typeof data.isDaytime === 'boolean' &&
      (data.precipitation === undefined ||
        typeof data.precipitation === 'number')
    );
  }
}
