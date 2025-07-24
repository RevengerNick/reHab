import { InputType, Field } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType()
export class RemoveChannelInput {
  @Field(() => String)
  @IsUUID()
  channelId: string;

  @Field(() => String)
  @IsUUID()
  projectId: string;
}