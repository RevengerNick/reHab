import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class CreateLogDto {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  @IsInt()
  exampleField: number;
}
