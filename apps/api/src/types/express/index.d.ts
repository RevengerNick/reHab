import { Project } from '@prisma/client';

// Расширяем глобальное пространство имен Express
declare global {
  namespace Express {
    export interface Request {
      // Добавляем наше кастомное свойство.
      // Оно опционально (?), потому что будет существовать только
      // в запросах, которые прошли через ApiKeyGuard.
      project?: Project;
    }
  }
}