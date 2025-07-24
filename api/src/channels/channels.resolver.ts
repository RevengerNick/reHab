import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.input';
import { UpdateChannelDto } from './dto/update-channel.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ProjectOwnerGuard } from '../projects/guards/project-owner.guard';
import { RemoveChannelInput } from './dto/delete-channel.input';

@Resolver(() => Channel)
@UseGuards(GqlAuthGuard)
export class ChannelsResolver {
  constructor(private readonly channelsService: ChannelsService) {}

  @Mutation(() => Channel)
  @UseGuards(ProjectOwnerGuard)
  createChannel(
    @Args('createChannelInput') createChannelInput: CreateChannelDto,
  ) {
    return this.channelsService.create(createChannelInput);
  }

  @Query(() => [Channel], { name: 'channels' })
  @UseGuards(ProjectOwnerGuard)
  findAllByProjectId(@Args('projectId', { type: () => String }) projectId: string) {
    return this.channelsService.findAllByProjectId(projectId);
  }

  @Mutation(() => Channel)
  @UseGuards(ProjectOwnerGuard)
  updateChannel(
    @Args('updateChannelInput') updateChannelInput: UpdateChannelDto,
  ) {
    return this.channelsService.update(updateChannelInput.id, updateChannelInput);
  }

  @Mutation(() => Channel)
  @UseGuards(ProjectOwnerGuard)
  removeChannel(
    @Args('input') input: RemoveChannelInput,
  ) {
    return this.channelsService.remove(input.channelId);
}
}