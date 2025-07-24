import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
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
      return false;
    }

    const projectId =
      args.projectId ||
      args.createChannelInput?.projectId ||
      args.updateChannelInput?.projectId;

    if (!projectId) {
      throw new Error(
        'ProjectOwnerGuard не смог найти projectId в аргументах запроса',
      );
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true },
    });

    if (project && project.userId === userId) {
      return true;
    }

    throw new ForbiddenException('У вас нет прав доступа к этому проекту');
  }
}
