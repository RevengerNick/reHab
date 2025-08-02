import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailWorkerService } from '../email/email-worker.service';

export interface NotificationEvent {
  eventId: string;
  projectId: string;
  timestamp: string;
  payload: object;
}

@Controller()
export class EmailWorkerController {
  constructor(private readonly emailWorkerService: EmailWorkerService) {}

  @MessagePattern('notifications_topic')
  handleNotification(@Payload() message: NotificationEvent) {
    this.emailWorkerService.processEmailTask(message);
  }
}