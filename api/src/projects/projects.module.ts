import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsResolver } from './projects.resolver';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, ProjectsResolver],
  exports: [ProjectsService],
})
export class ProjectsModule {}
