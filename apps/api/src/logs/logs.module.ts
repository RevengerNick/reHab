import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsResolver } from './logs.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  // PrismaService уже глобальный, но для ясности можно добавить его здесь
  providers: [LogsResolver, LogsService, PrismaService], 
})
export class LogsModule {}