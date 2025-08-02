import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ProjectOwnerGuard } from '../projects/guards/project-owner.guard';
import { SuccessResponse } from 'src/common/entities/response.entity';

@Resolver(() => Channel)
@UseGuards(GqlAuthGuard) // Все операции требуют аутентификации
export class ChannelsResolver {
  constructor(private readonly channelsService: ChannelsService) {}

  @Mutation(() => Channel, { name: 'createChannel' })
  @UseGuards(ProjectOwnerGuard) // Требует владения проектом
  createChannel(
    @Args('createChannelDto') createChannelDto: CreateChannelDto,
  ) {
    // Guard уже проверил projectPublicId, поэтому мы можем спокойно передавать DTO
    return this.channelsService.create(createChannelDto);
  }

  @Query(() => [Channel], { name: 'channels' })
  @UseGuards(ProjectOwnerGuard) // Требует владения проектом
  findAllByProjectId(
    @Args('publicId', { type: () => ID }) publicId: string,
  ) {
    return this.channelsService.findAllByProjectId(publicId);
  }

  @Mutation(() => Channel, { name: 'updateChannel' })
  @UseGuards(ProjectOwnerGuard) // Требует владения проектом
  updateChannel(
    @Args('updateChannelDto') updateChannelDto: UpdateChannelDto,
  ) {
    // Guard проверил projectPublicId, а сервис проверит связь канала с проектом
    return this.channelsService.update(updateChannelDto);
  }
  
  @Mutation(() => SuccessResponse, { name: 'removeChannel' })
  @UseGuards(ProjectOwnerGuard) // Требует владения проектом
  removeChannel(
      @Args('id', { type: () => ID }) id: string,
      @Args('publicId', { type: () => ID }) publicId: string,
  ) {
      return this.channelsService.remove(id, publicId);
  }
}