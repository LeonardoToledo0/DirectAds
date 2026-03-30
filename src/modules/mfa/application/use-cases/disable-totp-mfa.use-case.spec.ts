import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DisableTotpMfaUseCase } from './disable-totp-mfa.use-case';

describe('DisableTotpMfaUseCase', () => {
  it('clears the TOTP state for the authenticated user', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          mfaSecret: 'SECRET123',
          mfaEnabled: true,
          mfaConfirmedAt: new Date('2026-03-30T00:10:00.000Z'),
        }),
        update: jest.fn().mockResolvedValue({
          id: 'user-1',
          mfaSecret: null,
          mfaEnabled: false,
          mfaConfirmedAt: null,
        }),
      },
    } as unknown as PrismaService;
    const useCase = new DisableTotpMfaUseCase(prismaService);

    await expect(useCase.execute('user-1')).resolves.toEqual({
      mfaEnabled: false,
      mfaConfirmedAt: null,
    });
  });

  it('throws when the user does not exist', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;
    const useCase = new DisableTotpMfaUseCase(prismaService);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
