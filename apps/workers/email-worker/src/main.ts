import { NestFactory } from '@nestjs/core';
import { EmailWorkerModule } from './workers/email-worker.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // ИСПОЛЬЗУЕМ ПРАВИЛЬНЫЙ МЕТОД: createMicroservice
  // Он не ищет HTTP-драйверы и создает только микросервис.
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmailWorkerModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'email-consumers',
        },
      },
    },
  );

  // Запускаем микросервис с помощью app.listen()
  // Для микросервисов этот метод не открывает порт, а начинает слушать очередь.
  await app.listen();
}
bootstrap();