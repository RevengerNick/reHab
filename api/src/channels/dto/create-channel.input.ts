import { InputType, Field } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsObject, IsUUID } from 'class-validator';
import { ChannelTypeEnum } from '../entities/channel.entity';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateChannelDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @Field(() => ChannelTypeEnum)
  @IsIn(Object.values(ChannelTypeEnum))
  @IsNotEmpty()
  type: ChannelTypeEnum;

  // Конфигурация может быть любым объектом
  @Field(() => GraphQLJSONObject)
  @IsObject()
  @IsNotEmpty()
  config: object;
}
