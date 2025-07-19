import { Field, InputType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

@InputType()
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @Field()
  id: number;
}