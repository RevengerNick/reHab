import { NestFactory } from '@nestjs/core';
import { EmailWorkerModule } from './workers/email-worker.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(EmailWorkerModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'email-consumers', 
      },
    },
  });
  await app.listen();
}
bootstrap();