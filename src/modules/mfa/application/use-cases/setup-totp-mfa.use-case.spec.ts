import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import type { TotpProvider } from '../../domain/interfaces/totp-provider.interface';
import { SetupTotpMfaUseCase } from './setup-totp-mfa.use-case';

describe('SetupTotpMfaUseCase', () => {
  it('creates a new secret, stores it, and returns the QR setup data', async () => {
    const findUnique = jest.fn().mockResolvedValue({
      id: 'user-1',
      email: 'leona@example.com',
    });
    const update = jest.fn().mockResolvedValue(undefined);
    const prismaService = {
      user: {
        findUnique,
        update,
      },
    } as unknown as PrismaService;
    const generateSecret = jest.fn().mockReturnValue('SECRET123');
    const buildOtpAuthUrl = jest
      .fn()
      .mockReturnValue('otpauth://totp/DirectAds:leona@example.com');
    const generateQrCodeDataUrl = jest
      .fn()
      .mockResolvedValue('data:image/png;base64,qr');
    const totpProvider = {
      generateSecret,
      buildOtpAuthUrl,
      generateQrCodeDataUrl,
    } as unknown as TotpProvider;
    const useCase = new SetupTotpMfaUseCase(prismaService, totpProvider);

    await expect(useCase.execute('user-1')).resolves.toEqual({
      secret: 'SECRET123',
      otpauthUrl: 'otpauth://totp/DirectAds:leona@example.com',
      qrCodeDataUrl: 'data:image/png;base64,qr',
    });
    expect(update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        mfaSecret: 'SECRET123',
        mfaEnabled: false,
        mfaConfirmedAt: null,
      },
    });
  });

  it('fails when the user does not exist', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;
    const totpProvider = {} as TotpProvider;
    const useCase = new SetupTotpMfaUseCase(prismaService, totpProvider);

    await expect(useCase.execute('user-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
