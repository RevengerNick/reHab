import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationArgs } from '../../common/dto/pagination.args';
import { LogsFilterDto } from './logs-filter.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@ArgsType()
export class GetLogsArgs extends PaginationArgs {
  @Field(() => ID)
  publicId: string;

  @Field(() => LogsFilterDto, { nullable: true })
  @Type(() => LogsFilterDto)
  @ValidateNested()
  @IsOptional()
  filter?: LogsFilterDto;
}