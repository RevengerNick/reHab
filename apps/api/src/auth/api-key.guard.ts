import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('API-ключ не предоставлен или имеет неверный формат');
    }

    const apiKey = authHeader.split(' ')[1];
    if (!apiKey) {
      throw new UnauthorizedException('API-ключ не может быть пустым');
    }

    const project = await this.prisma.project.findUnique({
      where: { apiKey: apiKey },
    });

    if (!project) {
      throw new UnauthorizedException('Неверный API-ключ');
    }

    // Опционально: можно добавить проверку, не заблокирован ли проект
    // if (!project.isActive) { ... }

    // Прикрепляем найденный проект к объекту запроса для дальнейшего использования
    request.project = project;

    return true;
  }
}

    