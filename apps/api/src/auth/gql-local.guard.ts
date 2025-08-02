import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    console.log(context)
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    // Передаем аргументы GraphQL в тело запроса, чтобы LocalStrategy их нашла
    request.body = ctx.getArgs().loginDto;
    return request;
  }
}