import 'reflect-metadata';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { MfaModule } from './mfa.module';
import { StartMicrosoftMfaUseCase } from './application/use-cases/start-microsoft-mfa.use-case';
import { VerifyMicrosoftMfaUseCase } from './application/use-cases/verify-microsoft-mfa.use-case';
import { MICROSOFT_MFA_PROVIDER } from './domain/interfaces/microsoft-mfa-provider.interface';
import { MockMicrosoftMfaProvider } from './infrastructure/providers/mock-microsoft-mfa.provider';
import { MicrosoftMfaController } from './presentation/controllers/microsoft-mfa.controller';

describe('MfaModule', () => {
  it('registers the microsoft mfa controller', () => {
    const controllers = Reflect.getMetadata(
      MODULE_METADATA.CONTROLLERS,
      MfaModule,
    ) as unknown[] | undefined;

    expect(controllers).toEqual([MicrosoftMfaController]);
  });

  it('registers the microsoft provider and use cases', () => {
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      MfaModule,
    ) as unknown[] | undefined;

    expect(providers).toEqual([
      expect.any(Function),
      {
        provide: MICROSOFT_MFA_PROVIDER,
        useClass: MockMicrosoftMfaProvider,
      },
      StartMicrosoftMfaUseCase,
      VerifyMicrosoftMfaUseCase,
    ]);
  });
});
