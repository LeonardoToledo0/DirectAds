import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PasswordService } from '../services/password.service';
import { LoginUserUseCase } from './login-user.use-case';

describe('LoginUserUseCase', () => {
  it('returns the final access token when MFA is disabled', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Leona',
          email: 'leona@example.com',
          passwordHash: 'hashed',
          mfaEnabled: false,
          mfaSecret: null,
          createdAt: new Date('2026-03-30T00:00:00.000Z'),
          updatedAt: new Date('2026-03-30T00:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;
    const passwordService = {
      comparePassword: jest.fn().mockResolvedValue(true),
    } as unknown as PasswordService;
    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('token'),
    } as unknown as JwtService;
    const useCase = new LoginUserUseCase(
      prismaService,
      passwordService,
      jwtService,
    );

    await expect(
      useCase.execute({
        email: 'leona@example.com',
        password: 'secret123',
      }),
    ).resolves.toMatchObject({
      mfaRequired: false,
      accessToken: 'token',
      user: {
        id: 'user-1',
        email: 'leona@example.com',
        mfaEnabled: false,
      },
    });
  });

  it('returns a temporary MFA token when the user already has MFA enabled', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Leona',
          email: 'leona@example.com',
          passwordHash: 'hashed',
          mfaEnabled: true,
          mfaSecret: 'SECRET123',
          createdAt: new Date('2026-03-30T00:00:00.000Z'),
          updatedAt: new Date('2026-03-30T00:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;
    const passwordService = {
      comparePassword: jest.fn().mockResolvedValue(true),
    } as unknown as PasswordService;
    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('temporary-mfa-token'),
    } as unknown as JwtService;
    const useCase = new LoginUserUseCase(
      prismaService,
      passwordService,
      jwtService,
    );

    await expect(
      useCase.execute({
        email: 'leona@example.com',
        password: 'secret123',
      }),
    ).resolves.toMatchObject({
      mfaRequired: true,
      mfaToken: 'temporary-mfa-token',
      user: {
        id: 'user-1',
        email: 'leona@example.com',
        mfaEnabled: true,
      },
    });
  });

  it('rejects invalid credentials', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;
    const passwordService = {} as PasswordService;
    const jwtService = {} as JwtService;
    const useCase = new LoginUserUseCase(
      prismaService,
      passwordService,
      jwtService,
    );

    await expect(
      useCase.execute({
        email: 'leona@example.com',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects wrong passwords for an existing user', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Leona',
          email: 'leona@example.com',
          passwordHash: 'hashed',
          mfaEnabled: false,
          mfaSecret: null,
          createdAt: new Date('2026-03-30T00:00:00.000Z'),
          updatedAt: new Date('2026-03-30T00:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;
    const passwordService = {
      comparePassword: jest.fn().mockResolvedValue(false),
    } as unknown as PasswordService;
    const jwtService = {} as JwtService;
    const useCase = new LoginUserUseCase(
      prismaService,
      passwordService,
      jwtService,
    );

    await expect(
      useCase.execute({
        email: 'leona@example.com',
        password: 'wrong123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
