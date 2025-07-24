import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.input';
import { UpdateChannelDto } from './dto/update-channel.input';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  create(createChannelDto: CreateChannelDto) {
    const { projectId, type, config } = createChannelDto;
    return this.prisma.channel.create({
      data: { projectId, type, config },
    });
  }

  findAllByProjectId(projectId: string) {
    return this.prisma.channel.findMany({ where: { projectId } });
  }

  update(channelId: string, updateChannelDto: UpdateChannelDto) {
    return this.prisma.channel.update({
      where: { id: channelId },
      data: updateChannelDto,
    });
  }

  async remove(channelId: string, projectId: string) {
    const result = await this.prisma.channel.deleteMany({
      where: {
        id: channelId,
        projectId: projectId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException(`Канал с ID ${channelId} не найден в проекте ${projectId}`);
    }

    return { success: true };
  }
}