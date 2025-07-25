import { Field, InputType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @Field()
  @IsUUID()
  id: string;
}
