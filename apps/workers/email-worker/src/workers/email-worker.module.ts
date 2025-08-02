import { Module } from '@nestjs/common';
import { EmailWorkerController } from './email-worker.controller';
import { EmailWorkerService } from '../email/email-worker.service';
import { EmailModule } from '../email/email.module'; // <-- ИМПОРТИРУЕМ ЗДЕСЬ
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [EmailModule], // <-- ДОБАВЛЯЕМ В IMPORTS
  controllers: [EmailWorkerController],
  providers: [EmailWorkerService, PrismaService],
})  
export class EmailWorkerModule {}