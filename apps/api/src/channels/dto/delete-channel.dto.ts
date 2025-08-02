import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class DeleteChannelDto {
  @Field(() => String)
  @IsString()
  channelId: string;

  @Field(() => String)
  @IsString()
  publicId: string;
}
