import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PasswordService } from '../services/password.service';
import { RegisterUserUseCase } from './register-user.use-case';

describe('RegisterUserUseCase', () => {
  it('registers a user and returns a token without exposing the password hash', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Leona',
          email: 'leona@example.com',
          passwordHash: 'hashed',
          createdAt: new Date('2026-03-30T00:00:00.000Z'),
          updatedAt: new Date('2026-03-30T00:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;
    const passwordService = {
      hashPassword: jest.fn().mockResolvedValue('hashed'),
    } as unknown as PasswordService;
    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('token'),
    } as unknown as JwtService;
    const useCase = new RegisterUserUseCase(
      prismaService,
      passwordService,
      jwtService,
    );

    const result = await useCase.execute({
      name: 'Leona',
      email: 'Leona@Example.com',
      password: 'secret123',
    });

    expect(result).toEqual({
      accessToken: 'token',
      user: {
        id: 'user-1',
        name: 'Leona',
        email: 'leona@example.com',
        createdAt: new Date('2026-03-30T00:00:00.000Z'),
        updatedAt: new Date('2026-03-30T00:00:00.000Z'),
      },
    });
  });

  it('rejects duplicate emails', async () => {
    const prismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ id: 'user-1' }),
      },
    } as unknown as PrismaService;
    const passwordService = {} as PasswordService;
    const jwtService = {} as JwtService;
    const useCase = new RegisterUserUseCase(
      prismaService,
      passwordService,
      jwtService,
    );

    await expect(
      useCase.execute({
        name: 'Leona',
        email: 'leona@example.com',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
