import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateProjectDto {
  @Field()
  @IsString({ message: 'Название проекта должно быть строкой' })
  @IsNotEmpty({ message: 'Название проекта не может быть пустым' })
  name: string;
}
