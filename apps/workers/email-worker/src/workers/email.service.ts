import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  // Конструктор теперь пустой
  constructor() {}

  // Метод теперь принимает 'config' как аргумент
  async sendEmail(to: string, subject: string, text: string, config: any) {
    // Создаем транспорт динамически для каждого вызова
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure, // Обычно true, если порт 465, иначе false
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });

    const mailOptions = {
      from: '"Xabar.dev" <noreply@xabar.dev>',
      to: to,
      subject: subject,
      text: text,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      this.logger.log(`Сообщение успешно отправлено: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Ошибка при отправке email через ${config.host}`, error);
      throw error;
    }
  }
}