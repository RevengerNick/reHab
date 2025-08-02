import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Log {
  @Field(() => ID)
  id: string;

  @Field()
  status: string;

  @Field()
  channel: string;

  @Field()
  recipient: string;

  @Field({ nullable: true })
  errorDetails?: string;

  @Field({ nullable: true })
  sentAt?: Date;

  @Field()
  createdAt: Date;
}