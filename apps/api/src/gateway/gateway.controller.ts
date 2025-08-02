import { Controller, Post, Body, Inject, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { SendNotificationDto } from './dto/send-notification.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

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
    @Req() req: Request,
  ) {
    const { project } = req;

    if (!project) {
      throw new BadRequestException('Project not found on request.');
    }

    const requestedChannelTypes = [...new Set(data.recipients.map(r => r.channel))];

    const configuredChannels = await this.prisma.channel.findMany({
      where: {
        // ИСПРАВЛЕНИЕ ЗДЕСЬ:
        // Ищем каналы, у которых связанный проект имеет нужный publicId
        project: {
          publicId: project.publicId,
        },
        isEnabled: true,
        type: { in: requestedChannelTypes },
      },
      select: { type: true },
    });
    
    // ... остальная логика проверки (configuredChannelTypes, missingChannels) остается без изменений ...

    const eventId = uuidv4();

    const createdLogs = await this.prisma.log.createManyAndReturn({
      data: data.recipients.map(r => ({
        eventId,
        projectId: project.publicId, // Используем внутренний ID для связи
        status: 'ACCEPTED',
        channel: r.channel,
        recipient: r.to,
      })),
    });
    
    const recipientsWithLogIds = data.recipients.map(recipient => {
      const log = createdLogs.find(l => l.recipient === recipient.to && l.channel === recipient.channel);
      return {
        ...recipient,
        logId: log?.id,
      };
    });

    const event = {
      eventId,
      projectId: project.publicId,
      projectPublicId: project.publicId,
      timestamp: new Date().toISOString(),
      payload: {
        ...data,
        recipients: recipientsWithLogIds,
      },
    };

    this.kafkaClient.emit('notifications_topic', JSON.stringify(event));

    return { status: 202, message: 'Accepted' };
  }
}