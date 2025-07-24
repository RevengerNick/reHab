import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // Эта функция выполняется перед каждым тестом
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('time');
      });
  });

  // it('/projects (GET) - should fail without auth token', () => {
  //   return request(app.getHttpServer())
  //     .get('/graphql')
  //     .send({ query: '{ projects { id } }' })
  //     .expect(401);
  // });
});

describe('Auth and Projects Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService; // Получим доступ к Prisma для очистки

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Важно: применяем глобальный ValidationPipe, как в main.ts
    app.useGlobalPipes(new ValidationPipe()); 
    await app.init();

    // Получаем инстанс Prisma, чтобы чистить БД
    prisma = app.get<PrismaService>(PrismaService);
  });
  
  // После всех тестов в этом наборе, закрываем приложение
  afterAll(async () => {
    await app.close();
  });
  
  // Перед каждым тестом чистим таблицы
  beforeEach(async () => {
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });
  
  it('should register, login, and create a project', async () => {
    const userEmail = `test-${Date.now()}@example.com`;
    const userPassword = 'password123';
    let authToken = '';

    // 1. Шаг: Регистрация
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation RegisterUser($email: String!, $password: String!) {
            register(createUserInput: { email: $email, password: $password }) {
              id
              email
            }
          }
        `,
        variables: {
          email: userEmail,
          password: userPassword,
        },
      })
      .expect(200)
      .then((res) => {
        expect(res.body.data.register.email).toBe(userEmail);
      });

    // 2. Шаг: Логин и получение токена
    await request(app.getHttpServer())
      .post('/auth/login') // Логин у нас остался REST-эндпоинтом
      .send({ email: userEmail, password: userPassword })
      .expect(200)
      .then((res) => {
        expect(res.body.access_token).toBeDefined();
        authToken = res.body.access_token; // Сохраняем токен
      });
      
    // 3. Шаг: Создание проекта с использованием токена
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`) // Устанавливаем заголовок
      .send({
        query: `
          mutation CreateProject($name: String!) {
            createProject(createProjectInput: { name: $name }) {
              id
              name
            }
          }
        `,
        variables: {
          name: 'My E2E Test Project',
        },
      })
      .expect(200)
      .then((res) => {
        expect(res.body.data.createProject.name).toBe('My E2E Test Project');
      });
  });
});
