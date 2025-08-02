import { CanActivate, ExecutionContext, Injectable, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const args = ctx.getArgs();

    const userId = req.user?.id;
    if (!userId) {
      // Этот случай не должен происходить, если GqlAuthGuard отработал, но для безопасности проверяем
      return false;
    }

    let publicId: string | undefined;

    // Приоритет №1: Ищем напрямую (для простых Query)
    if (args.publicId) {
      publicId = args.publicId;
    } 
    // Приоритет №2: Ищем ВНУТРИ объекта 'input' (для Mutation)
    else if (args.input?.publicId) {
      publicId = args.input.publicId;
    }
    // Приоритет №3 (запасной): Ищем в любом другом вложенном объекте
    else {
      const inputObject = Object.values(args).find(
        (arg) => typeof arg === 'object' && arg !== null && 'publicId' in arg,
      ) as { publicId?: string };
      publicId = inputObject?.publicId;
    }
    
    if (!publicId) {
      // Эта ошибка теперь будет возникать только если мы СОВСЕМ неправильно сконфигурировали резолвер
      throw new InternalServerErrorException(
        'ProjectOwnerGuard: Не удалось определить publicId из аргументов запроса.',
      );
    }

    const project = await this.prisma.project.findUnique({
      where: { publicId: publicId },
      select: { userId: true },
    });

    if (project?.userId === userId) {
      return true; // Доступ разрешен
    }

    // Если дошли сюда, доступ запрещен.
    throw new ForbiddenException('У вас нет прав доступа к этому проекту');
  }
}