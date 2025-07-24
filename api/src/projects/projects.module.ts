import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsResolver } from './projects.resolver';
import { ProjectOwnerGuard } from './guards/project-owner.guard';

@Module({
  controllers: [],
  providers: [ProjectsService, PrismaService, ProjectsResolver, ProjectOwnerGuard],
  exports: [ProjectsService],
})
export class ProjectsModule {}
