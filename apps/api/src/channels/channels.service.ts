import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(createChannelDto: CreateChannelDto) {
    const { publicId, ...data } = createChannelDto;
    
    return this.prisma.channel.create({
      data: {
        ...data,
        project: {
          connect: { publicId: publicId },
        },
      },
      include: { project: true },
    });
  }

  findAllByProjectId(projectPublicId: string) {
    return this.prisma.channel.findMany({ 
      where: { 
        project: { 
          publicId: projectPublicId 
        } 
      },
      include: { project: true },
      orderBy: { priority: 'asc' }
    });
  }

  async update(updateChannelDto: UpdateChannelDto) {
    const { id, projectPublicId, ...dataToUpdate } = updateChannelDto;

    // Дополнительная проверка: убеждаемся, что канал принадлежит проекту
    const channelExists = await this.prisma.channel.findFirst({
        where: { id, project: { publicId: projectPublicId } }
    });

    if (!channelExists) {
        throw new NotFoundException(`Канал с ID ${id} не найден в проекте ${projectPublicId}`);
    }

    return this.prisma.channel.update({
      where: { id },
      data: dataToUpdate,
      include: { project: true },
    });
  }

  async remove(channelId: string, projectPublicId: string) {
    const result = await this.prisma.channel.deleteMany({
      where: {
        id: channelId,
        project: { publicId: projectPublicId },
      },
    });

    if (result.count === 0) {
      throw new NotFoundException(
        `Канал с ID ${channelId} не найден в проекте ${projectPublicId}`,
      );
    }

    return { success: true, id: channelId };
  }
}