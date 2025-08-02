import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateChannelDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEnum(['EMAIL', 'SMS'])
  type: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  provider: string;

  @Field(() => Int, { defaultValue: 0 })
  @IsNumber()
  priority: number;

  @Field(() => GraphQLJSONObject)
  @IsObject()
  config: object;
}