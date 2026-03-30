process.env.JWT_SECRET = 'test-jwt-secret';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';
import { PasswordService } from '../src/modules/auth/application/services/password.service';

interface AuthResponseBody {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface MeResponseBody {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

describe('Auth endpoints (e2e)', () => {
  let app: INestApplication;
  let passwordService: PasswordService;
  let users: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }>;

  beforeAll(async () => {
    users = [];
    const prismaService = {
      enableShutdownHooks: jest.fn(),
      user: {
        deleteMany: jest.fn().mockImplementation(() => {
          users = [];
          return { count: 0 };
        }),
        findUnique: jest
          .fn()
          .mockImplementation(
            ({ where }: { where: { id?: string; email?: string } }) => {
              if (where.id) {
                return users.find((user) => user.id === where.id) ?? null;
              }

              if (where.email) {
                return users.find((user) => user.email === where.email) ?? null;
              }

              return null;
            },
          ),
        create: jest
          .fn()
          .mockImplementation(
            ({
              data,
            }: {
              data: { name: string; email: string; passwordHash: string };
            }) => {
              const user = {
                id: `user-${users.length + 1}`,
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                createdAt: new Date('2026-03-30T00:00:00.000Z'),
                updatedAt: new Date('2026-03-30T00:00:00.000Z'),
              };
              users.push(user);
              return user;
            },
          ),
      },
    } as unknown as PrismaService;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    passwordService = app.get(PasswordService);
    await app.init();
  });

  beforeEach(() => {
    users = [];
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers, logs in, and returns the authenticated user', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const registerResponse = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Leona',
        email: 'leona@example.com',
        password: 'secret123',
      });
    const registerBody = registerResponse.body as AuthResponseBody;

    expect(registerResponse.status).toBe(201);
    expect(registerBody.user.email).toBe('leona@example.com');
    expect(registerBody.accessToken).toEqual(expect.any(String));

    const loginResponse = await request(server).post('/api/auth/login').send({
      email: 'leona@example.com',
      password: 'secret123',
    });
    const loginBody = loginResponse.body as AuthResponseBody;

    expect(loginResponse.status).toBe(201);
    expect(loginBody.accessToken).toEqual(expect.any(String));

    const meResponse = await request(server)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginBody.accessToken}`);
    const meBody = meResponse.body as MeResponseBody;

    expect(meResponse.status).toBe(200);
    expect(meBody.email).toBe('leona@example.com');
    expect(
      await passwordService.comparePassword('secret123', users[0].passwordHash),
    ).toBe(true);
  });
});
