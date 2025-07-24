// src/projects/entities/project.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsDate, IsString, IsUUID } from 'class-validator';

@ObjectType()
export class Project {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field()  
  @IsString()
  name: string;
  
  @Field()  
  @IsString()
  apiKey: string;

  @Field()
  @IsDate()
  createdAt: Date;
}