import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
const Nodemailer = require("nodemailer");
import { MailtrapTransport } from 'mailtrap';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  /**
   * Отправляет email, используя предоставленную конфигурацию SMTP.
   * Этот метод не хранит состояние и создает транспорт "на лету".
   * @param recipient - Объект с данными получателя (например, { to: '...', variables: {...} })
   * @param config - JSON-объект с настройками SMTP из модели Channel
   */
  async sendSmtp(recipient: any, config: any) {
    // 1. Создаем транспорт динамически для каждого вызова
    const transporter = Nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465, // `secure:true` для порта 465, иначе false
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });

    // 2. Определяем параметры письма
    const mailOptions = {
      from: '"Xabar.dev" <notifications@xabar.dev>', // Можно сделать настраиваемым
      to: recipient.to,
      subject: 'Тестовое уведомление от Xabar.dev', // TODO: Сделать на основе шаблонов
      text: `Это тестовое уведомление для ${recipient.to}.`, // TODO: Сделать на основе шаблонов
    };

    // 3. Отправляем письмо и обрабатываем результат
    try {
      const info = await transporter.sendMail(mailOptions);
      this.logger.log(`Сообщение успешно отправлено через ${config.host}: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Ошибка при отправке email через ${config.host}`, error.stack);
      // Перебрасываем ошибку дальше, чтобы EmailWorkerService мог ее поймать
      // и запустить логику Circuit Breaker
      throw error;
    }
  }
  async sendMailtrapApi(recipient: any, config: any) {
    const { apiToken } = config;
    console.log(`apiToken: $${apiToken}$`);
    if (!apiToken) {
      throw new Error("Mailtrap API Token не найден в конфигурации канала.");
    }

    const transporter = Nodemailer.createTransport(
      MailtrapTransport({
        token: apiToken,
      })
    );

    const mailOptions = {
      from: { name: 'Mailtrap Test', address: 'RevengerNick@revenger.dev' },
      to: recipient.to,
      subject: 'Тестовое уведомление от Xabar.dev (API)',
      text: `Это тестовое уведомление для ${recipient.to}, отправленное через Mailtrap API.`,
      sandbox: true,
    };

    try {
      await transporter.sendMail(mailOptions).then((info) => {
        this.logger.log(`Сообщение успешно отправлено через Mailtrap API: ${info}`);
      })
    } catch (error) {
      this.logger.error(`Ошибка при отправке email через Mailtrap API`, error.stack);
      console.log(error)
      throw error;
    }
  }
}