import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GatewayService } from './gateway.service'; // Создадим его
import { TestSendInput } from './dto/test-send.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { SuccessResponse } from 'src/common/entities/response.entity';

@Resolver()
@UseGuards(GqlAuthGuard)
export class GatewayResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Mutation(() => SuccessResponse)
  testSend(@Args('input') input: TestSendInput) {
    return this.gatewayService.testSend(input);
  }
}