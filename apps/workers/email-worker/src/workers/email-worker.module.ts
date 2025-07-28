import { Module } from '@nestjs/common';
import { EmailWorkerController } from './email-worker.controller';
import { EmailWorkerService } from './email-worker.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';

@Module({
  imports: [],
  controllers: [EmailWorkerController],
  providers: [EmailWorkerService, PrismaService, EmailService],
})
export class EmailWorkerModule {}
