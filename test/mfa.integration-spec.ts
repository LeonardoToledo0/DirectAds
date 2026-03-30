import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { MfaController } from '../src/modules/mfa/presentation/controllers/mfa.controller';
import { EnableTotpMfaUseCase } from '../src/modules/mfa/application/use-cases/enable-totp-mfa.use-case';
import { SetupTotpMfaUseCase } from '../src/modules/mfa/application/use-cases/setup-totp-mfa.use-case';
import { VerifyTotpLoginUseCase } from '../src/modules/mfa/application/use-cases/verify-totp-login.use-case';

describe('Mfa module integration', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('wires the TOTP mfa controller and use cases through the module graph', () => {
    expect(moduleRef.get(MfaController)).toBeDefined();
    expect(moduleRef.get(SetupTotpMfaUseCase)).toBeDefined();
    expect(moduleRef.get(EnableTotpMfaUseCase)).toBeDefined();
    expect(moduleRef.get(VerifyTotpLoginUseCase)).toBeDefined();
  });
});
