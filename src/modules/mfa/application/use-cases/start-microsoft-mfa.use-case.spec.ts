import { JwtService } from '@nestjs/jwt';
import { StartMicrosoftMfaUseCase } from './start-microsoft-mfa.use-case';
import type { MicrosoftMfaProvider } from '../../domain/interfaces/microsoft-mfa-provider.interface';

describe('StartMicrosoftMfaUseCase', () => {
  it('creates the authorization URL and signed state for the microsoft flow', async () => {
    const buildAuthorizationUrl = jest
      .fn()
      .mockResolvedValue('https://login.microsoftonline.com/mock');
    const microsoftMfaProvider = {
      buildAuthorizationUrl,
    } as unknown as MicrosoftMfaProvider;
    const signAsync = jest.fn().mockResolvedValue('signed-state');
    const jwtService = {
      signAsync,
    } as unknown as JwtService;
    const useCase = new StartMicrosoftMfaUseCase(
      microsoftMfaProvider,
      jwtService,
    );

    const response = await useCase.execute({
      redirectUri: 'http://localhost:3000/auth/microsoft/callback',
    });

    expect(signAsync).toHaveBeenCalledWith(
      {
        provider: 'microsoft',
        purpose: 'mfa-start',
        redirectUri: 'http://localhost:3000/auth/microsoft/callback',
      },
      { expiresIn: '600s' },
    );
    expect(buildAuthorizationUrl).toHaveBeenCalledWith({
      state: 'signed-state',
      redirectUri: 'http://localhost:3000/auth/microsoft/callback',
    });
    expect(response.provider).toBe('microsoft');
    expect(response.state).toBe('signed-state');
    expect(response.authorizationUrl).toBe(
      'https://login.microsoftonline.com/mock',
    );
  });
});
