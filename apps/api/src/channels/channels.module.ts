import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsResolver } from './channels.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ChannelsResolver, ChannelsService, PrismaService],
})
export class ChannelsModule {}
