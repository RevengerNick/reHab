import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service'; // Убедитесь, что он импортирован

@Injectable()
export class EmailWorkerService {
  private readonly logger = new Logger(EmailWorkerService.name);
  private readonly FAILURE_THRESHOLD = 3; // Порог отключения

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService, // Инжектируем EmailService
  ) {}

  async processEmailTask(event: any) {
    this.logger.log(`[Email-Worker] Получена задача: ${event.eventId}`);
    const { projectId, payload } = event;

    const emailRecipients = payload.recipients.filter(r => r.channel === 'EMAIL');
    if (emailRecipients.length === 0) return;

    // ШАГ 1: Получаем ВСЕ активные email-конфигурации для проекта
    const emailChannelConfigs = await this.prisma.channel.findMany({
      where: {
        projectId: projectId,
        type: 'EMAIL',
        isEnabled: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (emailChannelConfigs.length === 0) {
      this.logger.warn(`Не найдено активных EMAIL конфигураций для проекта ${projectId}.`);
      // TODO: Обновить все логи для email-получателей на статус FAILED
      return;
    }

    this.logger.log(`Найдено конфигураций: ${emailChannelConfigs.length}. Начинаем обработку ${emailRecipients.length} получателей.`);

    // ШАГ 2: Обрабатываем КАЖДОГО получателя ИЗОЛИРОВАННО
     for (const recipient of emailRecipients) {
      let emailSent = false;

      for (const config of emailChannelConfigs) {
        try {
          await this.emailService.sendEmail(recipient.to, 'Тестовое уведомление из Xabar.dev!', `Привет! Это тестовое сообщение для ${recipient.to}.`, config.config);

          emailSent = true;
          this.logger.log(`УСПЕХ: Email для ${recipient.to} отправлен через ${config.id}.`);
          
          // ОБНОВЛЯЕМ ЛОГ НА УСПЕХ
          await this.prisma.log.update({
            where: { id: recipient.logId },
            data: { status: 'SENT', sentAt: new Date() },
          });

          // Если отправка прошла успешно, сбрасываем счетчик ошибок для этой конфигурации
          if (config.failureCount > 0) {
              await this.prisma.channel.update({ where: {id: config.id}, data: { failureCount: 0 }});
          }

          break; // Переходим к следующему получателю

        } catch (error) {
          this.logger.error(`ОШИБКА отправки через ${config.id}.`);
          
          // ЛОГИКА CIRCUIT BREAKER
          const updatedChannel = await this.prisma.channel.update({
            where: { id: config.id },
            data: {
              failureCount: { increment: 1 },
              lastFailureAt: new Date(),
            },
          });

          // Проверяем, не достигнут ли порог
          if (updatedChannel.failureCount >= this.FAILURE_THRESHOLD) {
            await this.prisma.channel.update({
              where: { id: config.id },
              data: { isEnabled: false },
            });
            this.logger.warn(`АВТООТКЛЮЧЕНИЕ: Канал ${config.id} отключен после ${updatedChannel.failureCount} ошибок подряд.`);
            // TODO: Положить задачу в другую Kafka-очередь 'user_alerts'
          }
        }
      }

      if (!emailSent) {
        this.logger.error(`ПРОВАЛ: Не удалось отправить email для ${recipient.to}.`);
        // ОБНОВЛЯЕМ ЛОГ НА ПРОВАЛ
        await this.prisma.log.update({
          where: { id: recipient.logId },
          data: { status: 'FAILED', errorDetails: "Ни один из настроенных каналов не смог отправить сообщение." },
        });
      }
    }
  }
}