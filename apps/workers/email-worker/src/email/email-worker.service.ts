// полный путь: apps/workers/email-worker/src/email-worker.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class EmailWorkerService {
  private readonly logger = new Logger(EmailWorkerService.name);
  private readonly FAILURE_THRESHOLD = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Главный метод-диспетчер. Получает событие из Kafka и решает,
   * как его обработать: как тестовое или как продакшен-событие.
   */
  async processEmailTask(event: any) {
    this.logger.log(`Получена задача: ${JSON.stringify(event, null, 2)}`);

    if (event.isTest) {
      await this.handleTestTask(event);
    } else {
      await this.handleProductionTask(event);
    }
  }

  /**
   * Обрабатывает тестовые отправки из "Песочницы".
   * Не создает и не обновляет логи.
   */
  private async handleTestTask(event: any) {
    const { channelId, payload } = event;
    const recipient = payload.recipients[0];

    this.logger.log(`[ТЕСТ] Обработка тестовой задачи для канала ${channelId}`);
    
    const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel || !channel.isEnabled) {
      this.logger.error(`[ТЕСТ] Канал ${channelId} не найден или выключен!`);
      // В будущем здесь можно отправить уведомление об ошибке обратно в дашборд
      return;
    }

    try {
      await this.sendViaProvider(recipient, channel);
      this.logger.log(`[ТЕСТ] Успешная тестовая отправка через канал "${channel.name}"`);
    } catch (error) {
      this.logger.error(`[ТЕСТ] Ошибка тестовой отправки: ${error.message}`);
    }
  }

  /**
   * Обрабатывает продакшен-отправки от REST API.
   * Включает полную логику обновления логов, фолбэка и Circuit Breaker.
   */
  private async handleProductionTask(event: any) {
    const { projectPublicId, payload, eventId } = event;
    
    const emailRecipients = payload.recipients.filter((r: any) => r.channel === 'EMAIL' && r.logId);
    if (emailRecipients.length === 0) {
      this.logger.log('Нет email-получателей с logId в этой задаче. Пропускаем.');
      return;
    }
    this.logger.log(`Найдено email-получателей для обработки: ${emailRecipients.length}`);

    const emailChannels = await this.prisma.channel.findMany({
      where: {
        project: { publicId: projectPublicId },
        type: 'EMAIL',
        isEnabled: true,
      },
      orderBy: { priority: 'asc' },
    });
    this.logger.log(`Найдено активных email-каналов: ${emailChannels.length}`);

    if (emailChannels.length === 0) {
      this.logger.warn(`[ПРОВАЛ] Не найдено активных EMAIL конфигураций для проекта ${projectPublicId}.`);
      await this.prisma.log.updateMany({
        where: { eventId: eventId, channel: 'EMAIL' },
        data: {
          status: 'FAILED',
          errorDetails: 'Для проекта не найдено ни одного активного Email-канала.',
        },
      });
      return;
    }

    for (const recipient of emailRecipients) {
      let emailSent = false;
      let lastError: Error | null = null;

      for (const channel of emailChannels) {
        try {
          await this.sendViaProvider(recipient, channel);
          emailSent = true;

          this.logger.log(`[УСПЕХ] Email для ${recipient.to} отправлен через канал "${channel.name}" (${channel.id}).`);

          await this.prisma.log.update({
            where: { id: recipient.logId },
            data: { status: 'SENT', sentAt: new Date(), errorDetails: null },
          });

          if (channel.failureCount > 0) {
            await this.prisma.channel.update({
              where: { id: channel.id },
              data: { failureCount: 0, lastFailureAt: null },
            });
          }
          
          break;

        } catch (error) {
          lastError = error;
          this.logger.error(`[ОШИБКА] Не удалось отправить для ${recipient.to} через канал "${channel.name}". Ошибка: ${error.message}`);
          
          const updatedChannel = await this.prisma.channel.update({
            where: { id: channel.id },
            data: {
              failureCount: { increment: 1 },
              lastFailureAt: new Date(),
            },
          });

          if (updatedChannel.failureCount >= this.FAILURE_THRESHOLD) {
            await this.prisma.channel.update({
              where: { id: channel.id },
              data: { isEnabled: false },
            });
            this.logger.warn(`[CIRCUIT BREAKER] Канал "${channel.name}" (${channel.id}) отключен после ${updatedChannel.failureCount} ошибок.`);
          }
        }
      }

      if (!emailSent) {
        this.logger.error(`[ПРОВАЛ] Не удалось отправить email для ${recipient.to} после всех попыток.`);
        await this.prisma.log.update({
          where: { id: recipient.logId },
          data: {
            status: 'FAILED',
            errorDetails: lastError ? lastError.message : "Неизвестная ошибка отправки.",
          },
        });
      }
    }
  }
  
  private async sendViaProvider(recipient: any, channel: any) {
    this.logger.log(`Используем провайдер ${channel.provider} для канала "${channel.name}"`);
    switch (channel.provider) {
      case 'GENERIC_SMTP':
        return this.emailService.sendSmtp(recipient, channel.config);
      
      case 'MAILTRAP_API':
        return this.emailService.sendMailtrapApi(recipient, channel.config);

      default:
        throw new Error(`Провайдер ${channel.provider} не поддерживается.`);
    }
  }
}