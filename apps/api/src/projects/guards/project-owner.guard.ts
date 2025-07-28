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

    // --- НОВАЯ, УНИВЕРСАЛЬНАЯ ЛОГИКА ПОИСКА projectId ---
    let projectId: string;

    // Приоритет №1: Ищем аргумент с именем 'projectId' напрямую.
    if (args.projectId && typeof args.projectId === 'string') {
      projectId = args.projectId;
    } 
    // Приоритет №2: Ищем в стандартном контейнере 'input'.
    else if (args.input?.projectId && typeof args.input.projectId === 'string') {
      projectId = args.input.projectId;
    } 
    // Приоритет №3 (запасной): Ищем ЛЮБОЙ объект в аргументах, у которого есть свойство 'projectId'.
    else {
      const inputObject = Object.values(args).find(
        (arg) => typeof arg === 'object' && arg !== null && 'projectId' in arg,
      ) as { projectId?: string };
      if (!inputObject?.projectId) {
        throw new InternalServerErrorException(
          'ProjectOwnerGuard: Не удалось определить projectId из аргументов запроса.',
        );
      }
      projectId = inputObject.projectId;
    }
    
    // Если после всех попыток projectId не найден, это ошибка конфигурации, а не доступа.
    if (!projectId) {
      throw new InternalServerErrorException(
        'ProjectOwnerGuard: Не удалось определить projectId из аргументов запроса.',
      );
    }
    // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true },
    });

    if (project?.userId === userId) {
      return true; // Доступ разрешен
    }

    // Если дошли сюда, доступ запрещен.
    throw new ForbiddenException('У вас нет прав доступа к этому проекту');
  }
}