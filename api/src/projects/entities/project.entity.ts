// src/projects/entities/project.entity.ts
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;
  
  @Field()
  apiKey: string;

  @Field()
  createdAt: Date;
}