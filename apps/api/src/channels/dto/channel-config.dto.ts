import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChannelConfigDto {
  @Field(() => String, { nullable: true })
  host?: string;

  @Field(() => Number, { nullable: true })
  port?: number;

  @Field(() => String, { nullable: true })
  user?: string;

  @Field(() => String, { nullable: true })
  pass?: string;

  @Field(() => String, { nullable: true })
  apiKey?: string;

  @Field(() => Boolean, { nullable: true })
  secure?: boolean;

  @Field(() => Boolean, { nullable: true })
  tls?: boolean;

  @Field(() => Boolean, { nullable: true })
  requireTLS?: boolean;

  @Field(() => String, { nullable: true })
  service?: string;

  @Field(() => String, { nullable: true })
  from?: string;

  @Field(() => String, { nullable: true })
  fromName?: string;
}
