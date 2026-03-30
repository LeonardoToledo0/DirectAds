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
    mfaEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface LoginResponseBody {
  mfaRequired: boolean;
  accessToken?: string;
  mfaToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
    mfaEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface MeResponseBody {
  id: string;
  name: string;
  email: string;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChangePasswordResponseBody {
  id: string;
  name: string;
  email: string;
  mfaEnabled: boolean;
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
    mfaSecret: string | null;
    mfaEnabled: boolean;
    mfaConfirmedAt: Date | null;
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
                mfaSecret: null,
                mfaEnabled: false,
                mfaConfirmedAt: null,
                createdAt: new Date('2026-03-30T00:00:00.000Z'),
                updatedAt: new Date('2026-03-30T00:00:00.000Z'),
              };
              users.push(user);
              return user;
            },
          ),
        update: jest.fn().mockImplementation(
          ({
            where,
            data,
          }: {
            where: { id: string };
            data: {
              passwordHash?: string;
              mfaSecret?: string | null;
              mfaEnabled?: boolean;
              mfaConfirmedAt?: Date | null;
            };
          }) => {
            const index = users.findIndex((user) => user.id === where.id);
            const currentUser = users[index];
            const updatedUser = {
              ...currentUser,
              passwordHash:
                data.passwordHash === undefined
                  ? currentUser.passwordHash
                  : data.passwordHash,
              mfaSecret:
                data.mfaSecret === undefined
                  ? currentUser.mfaSecret
                  : data.mfaSecret,
              mfaEnabled:
                data.mfaEnabled === undefined
                  ? currentUser.mfaEnabled
                  : data.mfaEnabled,
              mfaConfirmedAt:
                data.mfaConfirmedAt === undefined
                  ? currentUser.mfaConfirmedAt
                  : data.mfaConfirmedAt,
              updatedAt: new Date('2026-03-30T01:00:00.000Z'),
            };
            users[index] = updatedUser;
            return updatedUser;
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

  it('registers, logs in without MFA, and returns the authenticated user', async () => {
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
    expect(registerBody.user.mfaEnabled).toBe(false);
    expect(registerBody.accessToken).toEqual(expect.any(String));

    const loginResponse = await request(server).post('/api/auth/login').send({
      email: 'leona@example.com',
      password: 'secret123',
    });
    const loginBody = loginResponse.body as LoginResponseBody;

    expect(loginResponse.status).toBe(201);
    expect(loginBody.mfaRequired).toBe(false);
    expect(loginBody.accessToken).toEqual(expect.any(String));

    const meResponse = await request(server)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginBody.accessToken}`);
    const meBody = meResponse.body as MeResponseBody;

    expect(meResponse.status).toBe(200);
    expect(meBody.email).toBe('leona@example.com');
    expect(meBody.mfaEnabled).toBe(false);
    expect(
      await passwordService.comparePassword('secret123', users[0].passwordHash),
    ).toBe(true);
  });

  it('changes the password and invalidates the previous credentials', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const registerResponse = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Leona',
        email: 'leona@example.com',
        password: 'secret123',
      });
    const registerBody = registerResponse.body as AuthResponseBody;

    const changePasswordResponse = await request(server)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${registerBody.accessToken}`)
      .send({
        currentPassword: 'secret123',
        newPassword: 'secret456',
      });
    const changePasswordBody =
      changePasswordResponse.body as ChangePasswordResponseBody;

    expect(changePasswordResponse.status).toBe(200);
    expect(changePasswordBody.email).toBe('leona@example.com');
    expect(
      await passwordService.comparePassword('secret456', users[0].passwordHash),
    ).toBe(true);

    const oldLoginResponse = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'leona@example.com',
        password: 'secret123',
      });

    expect(oldLoginResponse.status).toBe(401);

    const newLoginResponse = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'leona@example.com',
        password: 'secret456',
      });
    const newLoginBody = newLoginResponse.body as LoginResponseBody;

    expect(newLoginResponse.status).toBe(201);
    expect(newLoginBody.mfaRequired).toBe(false);
    expect(newLoginBody.accessToken).toEqual(expect.any(String));
  });
});
