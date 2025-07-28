import { Controller, Post, Body, Inject, UseGuards, Req } from '@nestjs/common'; // <-- Заменили @Request на @Req
import { ClientKafka } from '@nestjs/microservices';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { SendNotificationDto } from './dto/send-notification.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express'; // <-- Этот импорт важен для TypeScript
import { BadRequestException } from '@nestjs/common';

@Controller('v1')
export class GatewayController {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  @Post('send')
  @UseGuards(ApiKeyGuard)
  async sendMessage(
    @Body() data: SendNotificationDto,
    @Req() req: Request, // <--- ИЗМЕНЕНИЕ ЗДЕСЬ: используем @Req()
  ) {
    // Теперь 'req' гарантированно будет объектом запроса
    const { project } = req;

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    const createdLogs = await this.prisma.log.createManyAndReturn({
      data: data.recipients.map(r => ({
        projectId: project.id,
        status: 'ACCEPTED',
        channel: r.channel,
        recipient: r.to,
      })),
    });
    
    // Сопоставляем получателей с их созданными логами
    const recipientsWithLogIds = data.recipients.map(recipient => {
      const log = createdLogs.find(l => l.recipient === recipient.to && l.channel === recipient.channel);
      return {
        ...recipient,
        logId: log?.id, // Добавляем ID лога
      };
    });
    
    // Обновляем payload для Kafka
    const event = {
      eventId: uuidv4(),
      projectId: project.id,
      timestamp: new Date().toISOString(),
      payload: {
        ...data,
        recipients: recipientsWithLogIds, // Передаем получателей с logId
      },
    };

    this.kafkaClient.emit('notifications_topic', JSON.stringify(event));

    return { status: 202, message: 'Accepted' };
  }
}