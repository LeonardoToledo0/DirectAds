import 'reflect-metadata';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { MfaModule } from './mfa.module';
import { EnableTotpMfaUseCase } from './application/use-cases/enable-totp-mfa.use-case';
import { SetupTotpMfaUseCase } from './application/use-cases/setup-totp-mfa.use-case';
import { VerifyTotpLoginUseCase } from './application/use-cases/verify-totp-login.use-case';
import { TOTP_PROVIDER } from './domain/interfaces/totp-provider.interface';
import { OtplibTotpProvider } from './infrastructure/providers/otplib-totp.provider';
import { MfaController } from './presentation/controllers/mfa.controller';

describe('MfaModule', () => {
  it('registers the mfa controller', () => {
    const controllers = Reflect.getMetadata(
      MODULE_METADATA.CONTROLLERS,
      MfaModule,
    ) as unknown[] | undefined;

    expect(controllers).toEqual([MfaController]);
  });

  it('registers the TOTP provider and use cases', () => {
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      MfaModule,
    ) as unknown[] | undefined;

    expect(providers).toEqual([
      {
        provide: TOTP_PROVIDER,
        useClass: OtplibTotpProvider,
      },
      SetupTotpMfaUseCase,
      EnableTotpMfaUseCase,
      VerifyTotpLoginUseCase,
    ]);
  });
});
