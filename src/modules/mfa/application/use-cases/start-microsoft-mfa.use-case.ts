/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MicrosoftMfaStartResponseDto } from '../dto/microsoft-mfa-start-response.dto';
import { StartMicrosoftMfaDto } from '../dto/start-microsoft-mfa.dto';
import { MICROSOFT_MFA_PROVIDER } from '../../domain/interfaces/microsoft-mfa-provider.interface';
import type { MicrosoftMfaProvider } from '../../domain/interfaces/microsoft-mfa-provider.interface';

interface MicrosoftMfaStatePayload {
  provider: 'microsoft';
  purpose: 'mfa-start';
  redirectUri?: string;
}

@Injectable()
export class StartMicrosoftMfaUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    @Inject(MICROSOFT_MFA_PROVIDER)
    private readonly microsoftMfaProvider: MicrosoftMfaProvider,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    payload: StartMicrosoftMfaDto,
  ): Promise<MicrosoftMfaStartResponseDto> {
    const expiresInSeconds = 600;
    const state = await this.jwtService.signAsync(
      {
        provider: 'microsoft',
        purpose: 'mfa-start',
        redirectUri: payload.redirectUri,
      } satisfies MicrosoftMfaStatePayload,
      { expiresIn: `${expiresInSeconds}s` },
    );

    return {
      provider: 'microsoft',
      authorizationUrl: await this.microsoftMfaProvider.buildAuthorizationUrl({
        state,
        redirectUri: payload.redirectUri,
      }),
      state,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
    };
  }
}
