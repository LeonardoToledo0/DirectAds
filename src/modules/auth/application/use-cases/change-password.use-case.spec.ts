import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PasswordService } from '../services/password.service';
import { ChangePasswordUseCase } from './change-password.use-case';

describe('ChangePasswordUseCase', () => {
  it('updates the password hash and returns the public user data', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Leona',
          email: 'leona@example.com',
          passwordHash: 'old-hash',
          mfaEnabled: true,
          createdAt: new Date('2026-03-30T00:00:00.000Z'),
          updatedAt: new Date('2026-03-30T00:00:00.000Z'),
        }),
        update: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Leona',
          email: 'leona@example.com',
          passwordHash: 'new-hash',
          mfaEnabled: true,
          createdAt: new Date('2026-03-30T00:00:00.000Z'),
          updatedAt: new Date('2026-03-30T01:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;
    const passwordService = {
      comparePassword: jest.fn().mockResolvedValue(true),
      hashPassword: jest.fn().mockResolvedValue('new-hash'),
    } as unknown as PasswordService;
    const useCase = new ChangePasswordUseCase(prismaService, passwordService);

    await expect(
      useCase.execute('user-1', {
        currentPassword: 'secret123',
        newPassword: 'secret456',
      }),
    ).resolves.toEqual({
      id: 'user-1',
      name: 'Leona',
      email: 'leona@example.com',
      mfaEnabled: true,
      createdAt: new Date('2026-03-30T00:00:00.000Z'),
      updatedAt: new Date('2026-03-30T01:00:00.000Z'),
    });
  });

  it('throws when the user does not exist', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;
    const passwordService = {} as PasswordService;
    const useCase = new ChangePasswordUseCase(prismaService, passwordService);

    await expect(
      useCase.execute('missing', {
        currentPassword: 'secret123',
        newPassword: 'secret456',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws when the current password is invalid', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          passwordHash: 'old-hash',
        }),
      },
    } as unknown as PrismaService;
    const passwordService = {
      comparePassword: jest.fn().mockResolvedValue(false),
    } as unknown as PasswordService;
    const useCase = new ChangePasswordUseCase(prismaService, passwordService);

    await expect(
      useCase.execute('user-1', {
        currentPassword: 'wrong123',
        newPassword: 'secret456',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws when the new password matches the current password', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          passwordHash: 'old-hash',
        }),
      },
    } as unknown as PrismaService;
    const passwordService = {
      comparePassword: jest.fn().mockResolvedValue(true),
    } as unknown as PasswordService;
    const useCase = new ChangePasswordUseCase(prismaService, passwordService);

    await expect(
      useCase.execute('user-1', {
        currentPassword: 'secret123',
        newPassword: 'secret123',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
