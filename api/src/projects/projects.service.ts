import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        userId,
      },
    });
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }

  async findAllByUserId(userId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { userId }
    });
  }

  async findOne(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id }
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string): Promise<Project> {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
