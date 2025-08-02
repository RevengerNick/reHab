import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateLogDto } from './create-log.dto';

@InputType()
export class UpdateLogDto extends PartialType(CreateLogDto) {
  @Field(() => Int)
  id: number;
}
