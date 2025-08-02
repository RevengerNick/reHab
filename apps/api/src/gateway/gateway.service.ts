import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TestSendInput } from './dto/test-send.input';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GatewayService {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async testSend(input: TestSendInput) {
    // ВАЖНО: Мы отправляем в Kafka сообщение другого формата!
    const event = {
      eventId: uuidv4(),
      isTest: true, // Флаг, что это тестовая отправка
      channelId: input.channelId, // ID конкретного канала
      payload: {
        recipients: [{ to: input.to }],
      },
    };
    this.kafkaClient.emit('notifications_topic', JSON.stringify(event));
    return { success: true };
  }
}