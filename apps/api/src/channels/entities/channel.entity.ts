import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Project } from 'src/projects/entities/project.entity';

@ObjectType()
export class Channel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  provider: string;

  @Field()
  isEnabled: boolean;

  @Field(() => Int)
  priority: number;
  
  @Field(() => GraphQLJSONObject)
  config: object;
  
  @Field(() => Project)
  project: Project;
}