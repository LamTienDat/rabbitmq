import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RabbitMQService } from './rabbitmq.service';
import { InputDataDto } from './dtos/inputData.dto';

@Controller('/v1/send-data')
@ApiTags('Send Data')
@ApiBearerAuth()
export class RabbitMQController {
  constructor(private rabbitMQService: RabbitMQService) {}

  @Post()
  async sendData(@Body() data: InputDataDto) {
    await this.rabbitMQService.sendToQueue(data);
    return { message: 'Data sent to RabbitMQ' };
  }
}
