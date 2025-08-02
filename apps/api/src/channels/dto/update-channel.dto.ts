import { InputType, Field, ID, PartialType, OmitType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateChannelDto } from './create-channel.dto';

@InputType()
export class UpdateChannelDto extends PartialType(
  OmitType(CreateChannelDto, ['publicId', 'type']),
) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString() // Используйте IsCuid, если хотите более строгую проверку
  id: string;

  // Добавляем projectPublicId обратно, так как он нужен для Guard'а
  @Field()
  @IsString()
  @IsNotEmpty()
  projectPublicId: string;
}