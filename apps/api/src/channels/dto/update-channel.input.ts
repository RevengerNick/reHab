import { CreateChannelDto } from './create-channel.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
