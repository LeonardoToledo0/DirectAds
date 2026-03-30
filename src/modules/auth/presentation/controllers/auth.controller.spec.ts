import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { GetAuthenticatedUserUseCase } from '../../application/use-cases/get-authenticated-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';

describe('AuthController', () => {
  let controller: AuthController;
  let registerUserUseCase: { execute: jest.Mock };
  let loginUserUseCase: { execute: jest.Mock };
  let getAuthenticatedUserUseCase: { execute: jest.Mock };

  beforeEach(async () => {
    registerUserUseCase = { execute: jest.fn() };
    loginUserUseCase = { execute: jest.fn() };
    getAuthenticatedUserUseCase = { execute: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegisterUserUseCase,
          useValue: registerUserUseCase,
        },
        {
          provide: LoginUserUseCase,
          useValue: loginUserUseCase,
        },
        {
          provide: GetAuthenticatedUserUseCase,
          useValue: getAuthenticatedUserUseCase,
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates register to the register use case', async () => {
    registerUserUseCase.execute.mockResolvedValue('registered');

    await expect(
      controller.register({
        name: 'Leona',
        email: 'leona@example.com',
        password: 'secret123',
      }),
    ).resolves.toBe('registered');
  });

  it('delegates login to the login use case', async () => {
    loginUserUseCase.execute.mockResolvedValue('logged');

    await expect(
      controller.login({
        email: 'leona@example.com',
        password: 'secret123',
      }),
    ).resolves.toBe('logged');
  });

  it('delegates me to the authenticated user use case', async () => {
    getAuthenticatedUserUseCase.execute.mockResolvedValue('me');

    await expect(
      controller.me({
        sub: 'user-1',
        email: 'leona@example.com',
      }),
    ).resolves.toBe('me');
  });
});
