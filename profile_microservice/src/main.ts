import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // const PORT = process.env.PORT || 5000;

  // NestFactory.create класс с методом позволяющим создать приложение
  // const app = await NestFactory.create(AppModule);

  // const config = new DocumentBuilder()
  //     .setTitle('Проект на NestJs + Typescript')
  //     .setDescription('Домашнее задание')
  //     .setVersion('1.0.0')
  //     .addTag('sumnic')
  //     .build()
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('swagger', app, document);

  // await app.listen(PORT, () => console.log(PORT));

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_URL],
      queue: 'user_queue',
      queueOptions: {
        durable: false
      },
    },
  });

  await app.listen();
}



bootstrap();
