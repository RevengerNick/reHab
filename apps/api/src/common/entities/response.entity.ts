import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SuccessResponse {
  @Field()
  success: boolean;

  @Field(() => ID, { nullable: true })
  id?: string;
}