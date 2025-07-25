import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE', // Уникальное имя-токен для инъекции
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Адрес нашего Kafka-брокера
          },
          consumer: {
            groupId: 'xabar-api-consumer' // Уникальный ID группы (необязателен для продюсера, но хорошая практика)
          }
        },
      },
    ]),
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}