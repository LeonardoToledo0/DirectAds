import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PasswordService } from '../../../auth/application/services/password.service';
import { VerifyMicrosoftMfaUseCase } from './verify-microsoft-mfa.use-case';
import type { MicrosoftMfaProvider } from '../../domain/interfaces/microsoft-mfa-provider.interface';

describe('VerifyMicrosoftMfaUseCase', () => {
  const identity = {
    providerUserId: 'microsoft-user-1',
    email: 'microsoft.user@example.com',
    name: 'Microsoft User',
    tenantId: 'test-tenant',
  };

  it('creates a new local user when the microsoft account is unknown', async () => {
    const exchangeCodeForIdentity = jest.fn().mockResolvedValue(identity);
    const verifySecondFactor = jest.fn().mockResolvedValue(true);
    const microsoftMfaProvider = {
      exchangeCodeForIdentity,
      verifySecondFactor,
    } as unknown as MicrosoftMfaProvider;
    const findUnique = jest
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    const create = jest.fn().mockResolvedValue({
      id: 'user-1',
      name: identity.name,
      email: identity.email,
      createdAt: new Date('2026-03-30T00:00:00.000Z'),
      updatedAt: new Date('2026-03-30T00:00:00.000Z'),
    });
    const prismaService = {
      user: {
        findUnique,
        create,
      },
    } as unknown as PrismaService;
    const hashPassword = jest
      .fn()
      .mockResolvedValue('hashed-microsoft-password');
    const passwordService = {
      hashPassword,
    } as unknown as PasswordService;
    const verifyAsync = jest
      .fn()
      .mockResolvedValue({ provider: 'microsoft', purpose: 'mfa-start' });
    const signAsync = jest.fn().mockResolvedValue('signed-access-token');
    const jwtService = {
      verifyAsync,
      signAsync,
    } as unknown as JwtService;
    const useCase = new VerifyMicrosoftMfaUseCase(
      microsoftMfaProvider,
      prismaService,
      passwordService,
      jwtService,
    );

    const response = await useCase.execute({
      code: 'mock-auth-code',
      state: 'signed-state',
      verificationCode: '123456',
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        name: 'Microsoft User',
        email: 'microsoft.user@example.com',
        passwordHash: 'hashed-microsoft-password',
        microsoftAccountId: 'microsoft-user-1',
      },
    });
    expect(response.accessToken).toBe('signed-access-token');
    expect(response.mfa.secondFactorVerified).toBe(true);
  });

  it('links the microsoft account to an existing user found by email', async () => {
    const exchangeCodeForIdentity = jest.fn().mockResolvedValue(identity);
    const verifySecondFactor = jest.fn().mockResolvedValue(true);
    const microsoftMfaProvider = {
      exchangeCodeForIdentity,
      verifySecondFactor,
    } as unknown as MicrosoftMfaProvider;
    const findUnique = jest
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'user-1', email: identity.email });
    const update = jest.fn().mockResolvedValue({
      id: 'user-1',
      name: identity.name,
      email: identity.email,
      microsoftAccountId: identity.providerUserId,
      createdAt: new Date('2026-03-30T00:00:00.000Z'),
      updatedAt: new Date('2026-03-30T00:00:00.000Z'),
    });
    const prismaService = {
      user: {
        findUnique,
        update,
      },
    } as unknown as PrismaService;
    const hashPassword = jest.fn();
    const passwordService = {
      hashPassword,
    } as unknown as PasswordService;
    const verifyAsync = jest
      .fn()
      .mockResolvedValue({ provider: 'microsoft', purpose: 'mfa-start' });
    const signAsync = jest.fn().mockResolvedValue('signed-access-token');
    const jwtService = {
      verifyAsync,
      signAsync,
    } as unknown as JwtService;
    const useCase = new VerifyMicrosoftMfaUseCase(
      microsoftMfaProvider,
      prismaService,
      passwordService,
      jwtService,
    );

    await useCase.execute({
      code: 'mock-auth-code',
      state: 'signed-state',
      verificationCode: '123456',
    });

    expect(update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        microsoftAccountId: 'microsoft-user-1',
      },
    });
    expect(hashPassword).not.toHaveBeenCalled();
  });

  it('reuses an existing user already linked to the microsoft account', async () => {
    const exchangeCodeForIdentity = jest.fn().mockResolvedValue(identity);
    const verifySecondFactor = jest.fn().mockResolvedValue(true);
    const microsoftMfaProvider = {
      exchangeCodeForIdentity,
      verifySecondFactor,
    } as unknown as MicrosoftMfaProvider;
    const findUnique = jest.fn().mockResolvedValue({
      id: 'user-1',
      name: identity.name,
      email: identity.email,
      microsoftAccountId: identity.providerUserId,
      createdAt: new Date('2026-03-30T00:00:00.000Z'),
      updatedAt: new Date('2026-03-30T00:00:00.000Z'),
    });
    const prismaService = {
      user: {
        findUnique,
      },
    } as unknown as PrismaService;
    const hashPassword = jest.fn();
    const passwordService = {
      hashPassword,
    } as unknown as PasswordService;
    const verifyAsync = jest
      .fn()
      .mockResolvedValue({ provider: 'microsoft', purpose: 'mfa-start' });
    const signAsync = jest.fn().mockResolvedValue('signed-access-token');
    const jwtService = {
      verifyAsync,
      signAsync,
    } as unknown as JwtService;
    const useCase = new VerifyMicrosoftMfaUseCase(
      microsoftMfaProvider,
      prismaService,
      passwordService,
      jwtService,
    );

    await useCase.execute({
      code: 'mock-auth-code',
      state: 'signed-state',
      verificationCode: '123456',
    });

    expect(findUnique).toHaveBeenCalledWith({
      where: { microsoftAccountId: 'microsoft-user-1' },
    });
    expect(hashPassword).not.toHaveBeenCalled();
  });
});
