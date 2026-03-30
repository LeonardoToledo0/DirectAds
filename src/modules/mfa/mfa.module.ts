import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MfaController } from './presentation/controllers/mfa.controller';
import { EnableTotpMfaUseCase } from './application/use-cases/enable-totp-mfa.use-case';
import { SetupTotpMfaUseCase } from './application/use-cases/setup-totp-mfa.use-case';
import { VerifyTotpLoginUseCase } from './application/use-cases/verify-totp-login.use-case';
import { TOTP_PROVIDER } from './domain/interfaces/totp-provider.interface';
import { OtplibTotpProvider } from './infrastructure/providers/otplib-totp.provider';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'directads-dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [MfaController],
  providers: [
    {
      provide: TOTP_PROVIDER,
      useClass: OtplibTotpProvider,
    },
    SetupTotpMfaUseCase,
    EnableTotpMfaUseCase,
    VerifyTotpLoginUseCase,
  ],
  exports: [SetupTotpMfaUseCase, EnableTotpMfaUseCase, VerifyTotpLoginUseCase],
})
export class MfaModule {}
