/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type {
  BuildMicrosoftAuthorizationUrlInput,
  MicrosoftIdentity,
  MicrosoftMfaProvider,
  VerifyMicrosoftSecondFactorInput,
} from '../../domain/interfaces/microsoft-mfa-provider.interface';

@Injectable()
export class MockMicrosoftMfaProvider implements MicrosoftMfaProvider {
  buildAuthorizationUrl(input: BuildMicrosoftAuthorizationUrlInput): string {
    const tenantId = process.env.MICROSOFT_TENANT_ID ?? 'common';
    const clientId =
      process.env.MICROSOFT_CLIENT_ID ?? 'directads-local-client';
    const redirectUri =
      input.redirectUri ??
      process.env.MICROSOFT_REDIRECT_URI ??
      'http://localhost:3000/api/mfa/microsoft/verify';

    const searchParams = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      response_mode: 'query',
      scope: 'openid profile email',
      state: input.state,
    });

    return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${searchParams.toString()}`;
  }

  exchangeCodeForIdentity(code: string): MicrosoftIdentity {
    const expectedCode =
      process.env.MICROSOFT_MOCK_AUTH_CODE ?? 'mock-microsoft-auth-code';

    if (code !== expectedCode) {
      throw new UnauthorizedException('Invalid Microsoft authorization code');
    }

    return {
      providerUserId: process.env.MICROSOFT_MOCK_USER_ID ?? 'microsoft-user-1',
      email:
        process.env.MICROSOFT_MOCK_USER_EMAIL ?? 'microsoft.user@example.com',
      name: process.env.MICROSOFT_MOCK_USER_NAME ?? 'Microsoft User',
      tenantId: process.env.MICROSOFT_TENANT_ID ?? 'common',
    };
  }

  verifySecondFactor(input: VerifyMicrosoftSecondFactorInput): boolean {
    const expectedVerificationCode =
      process.env.MICROSOFT_MOCK_VERIFICATION_CODE ?? '123456';

    if (input.verificationCode !== expectedVerificationCode) {
      throw new UnauthorizedException(
        'Invalid Microsoft MFA verification code',
      );
    }

    return true;
  }
}
