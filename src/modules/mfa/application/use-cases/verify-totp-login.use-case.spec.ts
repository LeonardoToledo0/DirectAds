import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import type { TotpProvider } from '../../domain/interfaces/totp-provider.interface';
import { VerifyTotpLoginUseCase } from './verify-totp-login.use-case';

describe('VerifyTotpLoginUseCase', () => {
  it('returns the final access token when the MFA token and TOTP code are valid', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Leona',
          email: 'leona@example.com',
          mfaEnabled: true,
          mfaSecret: 'SECRET123',
          createdAt: new Date('2026-03-30T00:00:00.000Z'),
          updatedAt: new Date('2026-03-30T00:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;
    const totpProvider = {
      verifyToken: jest.fn().mockReturnValue(true),
    } as unknown as TotpProvider;
    const verifyAsync = jest
      .fn()
      .mockResolvedValue({ sub: 'user-1', purpose: 'mfa-login' });
    const signAsync = jest.fn().mockResolvedValue('final-access-token');
    const jwtService = {
      verifyAsync,
      signAsync,
    } as unknown as JwtService;
    const useCase = new VerifyTotpLoginUseCase(
      prismaService,
      totpProvider,
      jwtService,
    );

    await expect(
      useCase.execute({ mfaToken: 'temporary-token', code: '123456' }),
    ).resolves.toMatchObject({
      accessToken: 'final-access-token',
      user: {
        id: 'user-1',
        email: 'leona@example.com',
        mfaEnabled: true,
      },
    });
  });

  it('rejects invalid TOTP codes', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          mfaEnabled: true,
          mfaSecret: 'SECRET123',
        }),
      },
    } as unknown as PrismaService;
    const totpProvider = {
      verifyToken: jest.fn().mockReturnValue(false),
    } as unknown as TotpProvider;
    const jwtService = {
      verifyAsync: jest
        .fn()
        .mockResolvedValue({ sub: 'user-1', purpose: 'mfa-login' }),
    } as unknown as JwtService;
    const useCase = new VerifyTotpLoginUseCase(
      prismaService,
      totpProvider,
      jwtService,
    );

    await expect(
      useCase.execute({ mfaToken: 'temporary-token', code: '123456' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
