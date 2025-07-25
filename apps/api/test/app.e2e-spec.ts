import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
});

describe('Auth and Projects Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService; 

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  beforeEach(async () => {
    await prisma.channel.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });
  
  it('should register, login, and create a project', async () => {
    const userEmail = `test-${Date.now()}@example.com`;
    const userPassword = 'Password123';
    let authToken = '';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: userEmail,
        password: userPassword,
      })
      .expect(201)
      .then((res) => {
        expect(res.body.email).toBe(userEmail);
      });

    await request(app.getHttpServer())
      .post('/auth/login') 
      .send({ email: userEmail, password: userPassword })
      .expect(200)
      .then((res) => {
        expect(res.body.access_token).toBeDefined();
        authToken = res.body.access_token; 
      });
    
    
      
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
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
