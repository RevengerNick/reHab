import { Controller, Post, Body, Inject, ValidationPipe, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
//import { Public } from '../auth/public.decorator'; // Мы создадим этот декоратор
import { ApiKeyGuard } from '../auth/api-key.guard'; // И этот тоже

@Controller('v1')
export class GatewayController {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}
  
  // Вызывается при старте приложения
  async onModuleInit() {
    // Подключаемся к Kafka
    await this.kafkaClient.connect();
  }

  @Post('send')
  @UseGuards(ApiKeyGuard) // Включим это на следующем шаге
  // @Public() // Отключаем JWT-аутентификацию для этого эндпоинта
  async sendMessage(@Body(new ValidationPipe()) data: any) {
    // 'emit' - это fire-and-forget. Отправляем и не ждем ответа.
    this.kafkaClient.emit('notifications_topic', JSON.stringify(data));
    
    // Возвращаем правильный статус-код: "Принято в обработку"
    return { status: 202, message: 'Accepted' };
  }
}