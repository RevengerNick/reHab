import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectsModule } from './projects/projects.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, 'schema.gql'),
      sortSchema: true,
      formatError: (error: GraphQLError) => {
        // В development-режиме показываем все как есть для удобной отладки
        if (process.env.NODE_ENV !== 'production') {
          return error;
        }

        // В production-режиме
        const extensions = error.extensions;
        // Если это наша ожидаемая ошибка (например, Forbidden, Unauthorized) - показываем ее сообщение
        if (extensions && extensions.code !== 'INTERNAL_SERVER_ERROR') {
          return {
            message: error.message,
            extensions: { code: extensions.code },
          };
        }

        // А если это непредвиденная внутренняя ошибка сервера - скрываем детали
        return {
          message: 'Произошла внутренняя ошибка сервера',
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        };
      },
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    ChannelsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService, PrismaService],
})
export class AppModule {}
