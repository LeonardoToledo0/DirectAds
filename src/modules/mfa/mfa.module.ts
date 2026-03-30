import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordService } from '../auth/application/services/password.service';
import { MicrosoftMfaController } from './presentation/controllers/microsoft-mfa.controller';
import { StartMicrosoftMfaUseCase } from './application/use-cases/start-microsoft-mfa.use-case';
import { VerifyMicrosoftMfaUseCase } from './application/use-cases/verify-microsoft-mfa.use-case';
import { MICROSOFT_MFA_PROVIDER } from './domain/interfaces/microsoft-mfa-provider.interface';
import { MockMicrosoftMfaProvider } from './infrastructure/providers/mock-microsoft-mfa.provider';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'directads-dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [MicrosoftMfaController],
  providers: [
    PasswordService,
    {
      provide: MICROSOFT_MFA_PROVIDER,
      useClass: MockMicrosoftMfaProvider,
    },
    StartMicrosoftMfaUseCase,
    VerifyMicrosoftMfaUseCase,
  ],
  exports: [StartMicrosoftMfaUseCase, VerifyMicrosoftMfaUseCase],
})
export class MfaModule {}
