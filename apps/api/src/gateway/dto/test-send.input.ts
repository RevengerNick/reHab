import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class TestSendInput {
  @Field(() => ID)
  @IsNotEmpty()
  channelId: string; // ID конкретного канала для теста

  @Field()
  @IsString()
  @IsNotEmpty()
  to: string; // Адрес получателя
}