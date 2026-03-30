process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MICROSOFT_CLIENT_ID = 'directads-client';
process.env.MICROSOFT_TENANT_ID = 'test-tenant';
process.env.MICROSOFT_REDIRECT_URI =
  'http://localhost:3000/auth/microsoft/callback';
process.env.MICROSOFT_MOCK_AUTH_CODE = 'mock-microsoft-auth-code';
process.env.MICROSOFT_MOCK_VERIFICATION_CODE = '123456';
process.env.MICROSOFT_MOCK_USER_ID = 'microsoft-user-1';
process.env.MICROSOFT_MOCK_USER_EMAIL = 'microsoft.user@example.com';
process.env.MICROSOFT_MOCK_USER_NAME = 'Microsoft User';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

interface StartResponseBody {
  provider: 'microsoft';
  authorizationUrl: string;
  state: string;
  expiresAt: string;
}

interface VerifyResponseBody {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  mfa: {
    provider: 'microsoft';
    secondFactorVerified: boolean;
  };
}

describe('Microsoft MFA endpoints (e2e)', () => {
  let app: INestApplication;
  let users: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    microsoftAccountId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;

  beforeAll(async () => {
    users = [];
    const prismaService = {
      enableShutdownHooks: jest.fn(),
      user: {
        findUnique: jest.fn().mockImplementation(
          ({
            where,
          }: {
            where: {
              id?: string;
              email?: string;
              microsoftAccountId?: string;
            };
          }) => {
            if (where.id) {
              return users.find((user) => user.id === where.id) ?? null;
            }

            if (where.email) {
              return users.find((user) => user.email === where.email) ?? null;
            }

            if (where.microsoftAccountId) {
              return (
                users.find(
                  (user) =>
                    user.microsoftAccountId === where.microsoftAccountId,
                ) ?? null
              );
            }

            return null;
          },
        ),
        create: jest.fn().mockImplementation(
          ({
            data,
          }: {
            data: {
              name: string;
              email: string;
              passwordHash: string;
              microsoftAccountId?: string;
            };
          }) => {
            const user = {
              id: `user-${users.length + 1}`,
              name: data.name,
              email: data.email,
              passwordHash: data.passwordHash,
              microsoftAccountId: data.microsoftAccountId ?? null,
              createdAt: new Date('2026-03-30T00:00:00.000Z'),
              updatedAt: new Date('2026-03-30T00:00:00.000Z'),
            };
            users.push(user);
            return user;
          },
        ),
        update: jest
          .fn()
          .mockImplementation(
            ({
              where,
              data,
            }: {
              where: { id: string };
              data: { microsoftAccountId?: string };
            }) => {
              const userIndex = users.findIndex((user) => user.id === where.id);
              const currentUser = users[userIndex];
              const updatedUser = {
                ...currentUser,
                microsoftAccountId:
                  data.microsoftAccountId ?? currentUser.microsoftAccountId,
                updatedAt: new Date('2026-03-30T01:00:00.000Z'),
              };
              users[userIndex] = updatedUser;
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
    await app.init();
  });

  beforeEach(() => {
    users = [];
  });

  afterAll(async () => {
    await app.close();
  });

  it('starts and verifies the microsoft mfa flow, then links the identity on subsequent logins', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const startResponse = await request(server)
      .post('/api/mfa/microsoft/start')
      .send({ redirectUri: 'http://localhost:3000/auth/microsoft/callback' });
    const startBody = startResponse.body as StartResponseBody;

    expect(startResponse.status).toBe(201);
    expect(startBody.provider).toBe('microsoft');
    expect(startBody.authorizationUrl).toContain(
      'login.microsoftonline.com/test-tenant',
    );
    expect(startBody.state).toEqual(expect.any(String));

    const verifyResponse = await request(server)
      .post('/api/mfa/microsoft/verify')
      .send({
        code: 'mock-microsoft-auth-code',
        state: startBody.state,
        verificationCode: '123456',
      });
    const verifyBody = verifyResponse.body as VerifyResponseBody;

    expect(verifyResponse.status).toBe(201);
    expect(verifyBody.user.email).toBe('microsoft.user@example.com');
    expect(verifyBody.mfa.secondFactorVerified).toBe(true);
    expect(verifyBody.accessToken).toEqual(expect.any(String));
    expect(users).toHaveLength(1);
    expect(users[0].microsoftAccountId).toBe('microsoft-user-1');

    const secondVerifyResponse = await request(server)
      .post('/api/mfa/microsoft/verify')
      .send({
        code: 'mock-microsoft-auth-code',
        state: startBody.state,
        verificationCode: '123456',
      });

    expect(secondVerifyResponse.status).toBe(201);
    expect(users).toHaveLength(1);

    const invalidCodeResponse = await request(server)
      .post('/api/mfa/microsoft/verify')
      .send({
        code: 'invalid-code',
        state: startBody.state,
        verificationCode: '123456',
      });

    expect(invalidCodeResponse.status).toBe(401);
  });
});
