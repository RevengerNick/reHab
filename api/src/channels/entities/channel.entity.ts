import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

export enum ChannelTypeEnum {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  TELEGRAM = 'TELEGRAM',
  PUSH = 'PUSH',
}

import { registerEnumType } from '@nestjs/graphql';
registerEnumType(ChannelTypeEnum, {
  name: 'ChannelType',
});

@ObjectType()
export class Channel {
  @Field(() => ID)
  id: string;

  @Field(() => ChannelTypeEnum)
  type: ChannelTypeEnum;

  @Field(() => GraphQLJSONObject)
  config: object;

  @Field()
  isEnabled: boolean;

  @Field(() => String)
  projectId: string;
}