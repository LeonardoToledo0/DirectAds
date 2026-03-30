import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { GetAuthenticatedUserUseCase } from './get-authenticated-user.use-case';

describe('GetAuthenticatedUserUseCase', () => {
  it('returns the authenticated user without sensitive fields', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Leona',
          email: 'leona@example.com',
          passwordHash: 'hashed',
          mfaEnabled: true,
          createdAt: new Date('2026-03-30T00:00:00.000Z'),
          updatedAt: new Date('2026-03-30T00:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;
    const useCase = new GetAuthenticatedUserUseCase(prismaService);

    await expect(useCase.execute('user-1')).resolves.toEqual({
      id: 'user-1',
      name: 'Leona',
      email: 'leona@example.com',
      mfaEnabled: true,
      createdAt: new Date('2026-03-30T00:00:00.000Z'),
      updatedAt: new Date('2026-03-30T00:00:00.000Z'),
    });
  });

  it('throws when the user does not exist', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;
    const useCase = new GetAuthenticatedUserUseCase(prismaService);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
