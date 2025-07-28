import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min, Max, IsOptional } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, description: 'Количество записей для пропуска (для пагинации)' })
  @IsInt()
  @Min(0)
  @IsOptional()
  skip?: number = 0;

  @Field(() => Int, { nullable: true, description: 'Количество записей для получения' })
  @IsInt()
  @Min(1)
  @Max(100) // Устанавливаем максимальный лимит, чтобы защитить сервер от перегрузки
  @IsOptional()
  take?: number = 25; // Значение по умолчанию
}