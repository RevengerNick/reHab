import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsResolver } from './channels.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ProjectsModule],
  providers: [
    ChannelsResolver, 
    ChannelsService, 
    PrismaService
  ],
  exports: [ChannelsService]
})
export class ChannelsModule {}
