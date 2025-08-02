import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { LogsService } from './logs.service';
import { Log } from './entities/log.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ProjectOwnerGuard } from '../projects/guards/project-owner.guard';
import { GetLogsArgs } from './dto/get-logs.args';

@Resolver(() => Log)
@UseGuards(GqlAuthGuard)
export class LogsResolver {
  constructor(private readonly logsService: LogsService) {}

  @Query(() => [Log], { name: 'logs' })
  @UseGuards(ProjectOwnerGuard)
  // Используем ОДИН @Args() для всех аргументов
  findAll(@Args() args: GetLogsArgs) {
    const { publicId, skip, take, filter } = args;
    return this.logsService.findAll(publicId, { skip, take }, filter);
  }
}