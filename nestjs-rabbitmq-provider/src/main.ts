import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('This is the API documentation for the project')
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const corsOptions: CorsOptions = {
    origin: '*',
    allowedHeaders: '*',
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.use(bodyParser.urlencoded({ limit: '2gb', extended: true }));
  app.use(bodyParser.json({ limit: '2gb' }));
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
