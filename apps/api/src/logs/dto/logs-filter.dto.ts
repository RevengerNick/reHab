import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsIn } from 'class-validator';

@InputType()
export class LogsFilterDto {
  @Field({ nullable: true, description: 'Фильтр по статусу отправки' })
  @IsOptional()
  @IsIn(['ACCEPTED', 'SENT', 'FAILED'])
  status?: string;

  @Field({ nullable: true, description: 'Фильтр по каналу' })
  @IsOptional()
  @IsIn(['EMAIL', 'SMS', 'TELEGRAM', 'PUSH'])
  channel?: string;
  
  @Field({ nullable: true, description: 'Поиск по email, телефону и т.д.' })
  @IsOptional()
  @IsString()
  recipient?: string;
}
