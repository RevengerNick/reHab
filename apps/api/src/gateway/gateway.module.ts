import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GatewayResolver } from './gateway.resolver';
import { GatewayService } from './gateway.service';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE', // Уникальное имя-токен для инъекции
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'], // Адрес нашего Kafka-брокера
          },
          consumer: {
            groupId: 'xabar-api-consumer' // Уникальный ID группы (необязателен для продюсера, но хорошая практика)
          }
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayResolver, GatewayService],
})
export class GatewayModule {}