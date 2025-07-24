import { Module, Global } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

@Global() // Делаем модуль глобальным
@Module({
  providers: [UsersService, PrismaService],
  exports: [UsersService], // Экспортируем сервис для использования в других модулях
})
export class UsersModule {}
