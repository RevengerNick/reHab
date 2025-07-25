import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class EmailWorkerController {
  @MessagePattern('notifications_topic')
  handleNotification(@Payload() data: any) {
    console.log('[Email-Worker] Получена новая задача:', JSON.parse(data.value));
  }
}