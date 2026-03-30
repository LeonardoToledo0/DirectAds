import { Test, TestingModule } from '@nestjs/testing';
import { MicrosoftMfaController } from './microsoft-mfa.controller';
import { StartMicrosoftMfaUseCase } from '../../application/use-cases/start-microsoft-mfa.use-case';
import { VerifyMicrosoftMfaUseCase } from '../../application/use-cases/verify-microsoft-mfa.use-case';

describe('MicrosoftMfaController', () => {
  let controller: MicrosoftMfaController;
  let startMicrosoftMfaUseCase: { execute: jest.Mock };
  let verifyMicrosoftMfaUseCase: { execute: jest.Mock };

  beforeEach(async () => {
    startMicrosoftMfaUseCase = { execute: jest.fn() };
    verifyMicrosoftMfaUseCase = { execute: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MicrosoftMfaController],
      providers: [
        {
          provide: StartMicrosoftMfaUseCase,
          useValue: startMicrosoftMfaUseCase,
        },
        {
          provide: VerifyMicrosoftMfaUseCase,
          useValue: verifyMicrosoftMfaUseCase,
        },
      ],
    }).compile();

    controller = moduleRef.get(MicrosoftMfaController);
  });

  it('starts the microsoft mfa flow', async () => {
    startMicrosoftMfaUseCase.execute.mockResolvedValue('started');

    await expect(
      controller.start({ redirectUri: 'http://localhost:3000/callback' }),
    ).resolves.toBe('started');
  });

  it('verifies the microsoft mfa flow', async () => {
    verifyMicrosoftMfaUseCase.execute.mockResolvedValue('verified');

    await expect(
      controller.verify({
        code: 'mock-auth-code',
        state: 'signed-state',
        verificationCode: '123456',
      }),
    ).resolves.toBe('verified');
  });
});
