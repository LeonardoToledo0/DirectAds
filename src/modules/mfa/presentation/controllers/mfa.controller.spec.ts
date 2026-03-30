import { Test, TestingModule } from '@nestjs/testing';
import { MfaController } from './mfa.controller';
import { EnableTotpMfaUseCase } from '../../application/use-cases/enable-totp-mfa.use-case';
import { SetupTotpMfaUseCase } from '../../application/use-cases/setup-totp-mfa.use-case';
import { VerifyTotpLoginUseCase } from '../../application/use-cases/verify-totp-login.use-case';

describe('MfaController', () => {
  let controller: MfaController;
  let setupTotpMfaUseCase: { execute: jest.Mock };
  let enableTotpMfaUseCase: { execute: jest.Mock };
  let verifyTotpLoginUseCase: { execute: jest.Mock };

  beforeEach(async () => {
    setupTotpMfaUseCase = { execute: jest.fn() };
    enableTotpMfaUseCase = { execute: jest.fn() };
    verifyTotpLoginUseCase = { execute: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MfaController],
      providers: [
        { provide: SetupTotpMfaUseCase, useValue: setupTotpMfaUseCase },
        { provide: EnableTotpMfaUseCase, useValue: enableTotpMfaUseCase },
        { provide: VerifyTotpLoginUseCase, useValue: verifyTotpLoginUseCase },
      ],
    }).compile();

    controller = moduleRef.get(MfaController);
  });

  it('starts the TOTP setup for the authenticated user', async () => {
    setupTotpMfaUseCase.execute.mockResolvedValue('setup');

    await expect(
      controller.setup({ sub: 'user-1', email: 'leona@example.com' }),
    ).resolves.toBe('setup');
  });

  it('enables TOTP MFA for the authenticated user', async () => {
    enableTotpMfaUseCase.execute.mockResolvedValue('enabled');

    await expect(
      controller.enable(
        { sub: 'user-1', email: 'leona@example.com' },
        { code: '123456' },
      ),
    ).resolves.toBe('enabled');
  });

  it('verifies the TOTP login challenge', async () => {
    verifyTotpLoginUseCase.execute.mockResolvedValue('verified');

    await expect(
      controller.verifyLogin({ mfaToken: 'temporary-token', code: '123456' }),
    ).resolves.toBe('verified');
  });
});
