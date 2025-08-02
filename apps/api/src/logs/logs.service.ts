import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LogsFilterDto } from './dto/logs-filter.dto';
import { PaginationArgs } from '../common/dto/pagination.args';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(
    publicId: string,
    pagination: PaginationArgs,
    filter?: LogsFilterDto,
  ) {
    const where: Prisma.LogWhereInput = { projectId: publicId };

    if (filter) {
      if (filter.status) {
        where.status = filter.status;
      }
      if (filter.channel) {
        where.channel = filter.channel;
      }
      if (filter.recipient) {
        where.recipient = {
          contains: filter.recipient,
          mode: 'insensitive', // Поиск без учета регистра
        };
      }
    }

    return this.prisma.log.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}