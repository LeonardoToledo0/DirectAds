process.env.JWT_SECRET = 'test-jwt-secret';
process.env.TOTP_APP_NAME = 'DirectAds';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';
import { generateTotpToken } from '../src/modules/mfa/infrastructure/providers/totp.utils';

interface RegisterResponseBody {
  accessToken: string;
  user: {
    id: string;
    email: string;
    mfaEnabled: boolean;
  };
}

interface SetupResponseBody {
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
}

interface EnableResponseBody {
  mfaEnabled: boolean;
  mfaConfirmedAt: string;
}

interface LoginResponseBody {
  mfaRequired: boolean;
  accessToken?: string;
  mfaToken?: string;
  user: {
    id: string;
    email: string;
    mfaEnabled: boolean;
  };
}

interface VerifyLoginResponseBody {
  accessToken: string;
  user: {
    id: string;
    email: string;
    mfaEnabled: boolean;
  };
}

interface DisableMfaResponseBody {
  mfaEnabled: boolean;
  mfaConfirmedAt: string | null;
}

describe('TOTP MFA endpoints (e2e)', () => {
  let app: INestApplication;
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
              mfaSecret?: string | null;
              mfaEnabled?: boolean;
              mfaConfirmedAt?: Date | null;
            };
          }) => {
            const index = users.findIndex((user) => user.id === where.id);
            const currentUser = users[index];
            const updatedUser = {
              ...currentUser,
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
    await app.init();
  });

  beforeEach(() => {
    users = [];
  });

  afterAll(async () => {
    await app.close();
  });

  it('configures TOTP with QR code and requires the token on subsequent login', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const registerResponse = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Leona',
        email: 'leona@example.com',
        password: 'secret123',
      });
    const registerBody = registerResponse.body as RegisterResponseBody;

    const setupResponse = await request(server)
      .post('/api/mfa/setup')
      .set('Authorization', `Bearer ${registerBody.accessToken}`)
      .send();
    const setupBody = setupResponse.body as SetupResponseBody;

    expect(setupResponse.status).toBe(201);
    expect(setupBody.secret).toEqual(expect.any(String));
    expect(setupBody.otpauthUrl).toContain('otpauth://totp/');
    expect(setupBody.qrCodeDataUrl).toContain('data:image/png;base64,');

    const enableCode = generateTotpToken(setupBody.secret);
    const enableResponse = await request(server)
      .post('/api/mfa/enable')
      .set('Authorization', `Bearer ${registerBody.accessToken}`)
      .send({ code: enableCode });
    const enableBody = enableResponse.body as EnableResponseBody;

    expect(enableResponse.status).toBe(201);
    expect(enableBody.mfaEnabled).toBe(true);
    expect(users[0].mfaEnabled).toBe(true);

    const loginResponse = await request(server).post('/api/auth/login').send({
      email: 'leona@example.com',
      password: 'secret123',
    });
    const loginBody = loginResponse.body as LoginResponseBody;

    expect(loginResponse.status).toBe(201);
    expect(loginBody.mfaRequired).toBe(true);
    expect(loginBody.mfaToken).toEqual(expect.any(String));
    expect(loginBody.accessToken).toBeUndefined();

    const verifyLoginResponse = await request(server)
      .post('/api/mfa/verify-login')
      .send({
        mfaToken: loginBody.mfaToken,
        code: generateTotpToken(users[0].mfaSecret as string),
      });
    const verifyLoginBody = verifyLoginResponse.body as VerifyLoginResponseBody;

    expect(verifyLoginResponse.status).toBe(201);
    expect(verifyLoginBody.accessToken).toEqual(expect.any(String));
    expect(verifyLoginBody.user.mfaEnabled).toBe(true);
  });

  it('disables MFA and allows the next login without the second step', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const registerResponse = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Leona',
        email: 'leona@example.com',
        password: 'secret123',
      });
    const registerBody = registerResponse.body as RegisterResponseBody;

    const setupResponse = await request(server)
      .post('/api/mfa/setup')
      .set('Authorization', `Bearer ${registerBody.accessToken}`)
      .send();
    const setupBody = setupResponse.body as SetupResponseBody;

    await request(server)
      .post('/api/mfa/enable')
      .set('Authorization', `Bearer ${registerBody.accessToken}`)
      .send({ code: generateTotpToken(setupBody.secret) })
      .expect(201);

    const disableResponse = await request(server)
      .delete('/api/mfa')
      .set('Authorization', `Bearer ${registerBody.accessToken}`)
      .send();
    const disableBody = disableResponse.body as DisableMfaResponseBody;

    expect(disableResponse.status).toBe(200);
    expect(disableBody.mfaEnabled).toBe(false);
    expect(disableBody.mfaConfirmedAt).toBeNull();
    expect(users[0].mfaEnabled).toBe(false);
    expect(users[0].mfaSecret).toBeNull();

    const loginResponse = await request(server).post('/api/auth/login').send({
      email: 'leona@example.com',
      password: 'secret123',
    });
    const loginBody = loginResponse.body as LoginResponseBody;

    expect(loginResponse.status).toBe(201);
    expect(loginBody.mfaRequired).toBe(false);
    expect(loginBody.accessToken).toEqual(expect.any(String));
    expect(loginBody.mfaToken).toBeUndefined();
  });
});
