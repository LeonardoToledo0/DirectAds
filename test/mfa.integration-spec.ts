import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { MicrosoftMfaController } from '../src/modules/mfa/presentation/controllers/microsoft-mfa.controller';
import { StartMicrosoftMfaUseCase } from '../src/modules/mfa/application/use-cases/start-microsoft-mfa.use-case';
import { VerifyMicrosoftMfaUseCase } from '../src/modules/mfa/application/use-cases/verify-microsoft-mfa.use-case';

describe('Mfa module integration', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('wires the microsoft mfa controller and use cases through the module graph', () => {
    expect(moduleRef.get(MicrosoftMfaController)).toBeDefined();
    expect(moduleRef.get(StartMicrosoftMfaUseCase)).toBeDefined();
    expect(moduleRef.get(VerifyMicrosoftMfaUseCase)).toBeDefined();
  });
});
