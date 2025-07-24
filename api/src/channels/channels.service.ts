import { Injectable } from '@nestjs/common';
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

  remove(channelId: string) {
    return this.prisma.channel.delete({ where: { id: channelId } });
  }
}