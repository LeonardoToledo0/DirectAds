import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import type { TotpProvider } from '../../domain/interfaces/totp-provider.interface';
import { EnableTotpMfaUseCase } from './enable-totp-mfa.use-case';

describe('EnableTotpMfaUseCase', () => {
  it('enables MFA when the provided TOTP code is valid', async () => {
    const findUnique = jest.fn().mockResolvedValue({
      id: 'user-1',
      mfaSecret: 'SECRET123',
    });
    const update = jest.fn().mockResolvedValue(undefined);
    const prismaService = {
      user: {
        findUnique,
        update,
      },
    } as unknown as PrismaService;
    const verifyToken = jest.fn().mockReturnValue(true);
    const totpProvider = {
      verifyToken,
    } as unknown as TotpProvider;
    const useCase = new EnableTotpMfaUseCase(prismaService, totpProvider);

    const result = await useCase.execute('user-1', { code: '123456' });

    expect(result.mfaEnabled).toBe(true);
    expect(result.mfaConfirmedAt).toBeInstanceOf(Date);
    expect(update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        mfaEnabled: true,
        mfaConfirmedAt: result.mfaConfirmedAt,
      },
    });
  });

  it('fails when setup was not started', async () => {
    const prismaService = {
      user: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: 'user-1', mfaSecret: null }),
      },
    } as unknown as PrismaService;
    const totpProvider = {} as TotpProvider;
    const useCase = new EnableTotpMfaUseCase(prismaService, totpProvider);

    await expect(
      useCase.execute('user-1', { code: '123456' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('fails when the user does not exist', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;
    const totpProvider = {} as TotpProvider;
    const useCase = new EnableTotpMfaUseCase(prismaService, totpProvider);

    await expect(
      useCase.execute('user-1', { code: '123456' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('fails when the TOTP code is invalid', async () => {
    const prismaService = {
      user: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: 'user-1', mfaSecret: 'SECRET123' }),
      },
    } as unknown as PrismaService;
    const totpProvider = {
      verifyToken: jest.fn().mockReturnValue(false),
    } as unknown as TotpProvider;
    const useCase = new EnableTotpMfaUseCase(prismaService, totpProvider);

    await expect(
      useCase.execute('user-1', { code: '123456' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
