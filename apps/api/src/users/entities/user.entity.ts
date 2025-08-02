import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsDate, IsString, IsUUID } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsDate()
  createdAt: Date;
}
