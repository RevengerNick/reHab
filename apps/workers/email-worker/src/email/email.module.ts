import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // Экспортируем сервис, чтобы он был доступен для инъекции
})
export class EmailModule {}