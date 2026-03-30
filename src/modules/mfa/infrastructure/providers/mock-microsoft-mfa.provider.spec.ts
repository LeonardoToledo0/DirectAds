import { MockMicrosoftMfaProvider } from './mock-microsoft-mfa.provider';

describe('MockMicrosoftMfaProvider', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.MICROSOFT_CLIENT_ID = 'directads-client';
    process.env.MICROSOFT_TENANT_ID = 'test-tenant';
    process.env.MICROSOFT_REDIRECT_URI =
      'http://localhost:3000/api/mfa/microsoft/verify';
    process.env.MICROSOFT_MOCK_AUTH_CODE = 'mock-auth-code';
    process.env.MICROSOFT_MOCK_VERIFICATION_CODE = '123456';
    process.env.MICROSOFT_MOCK_USER_ID = 'microsoft-user-1';
    process.env.MICROSOFT_MOCK_USER_EMAIL = 'microsoft.user@example.com';
    process.env.MICROSOFT_MOCK_USER_NAME = 'Microsoft User';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('builds the authorization URL with the configured microsoft values', () => {
    const provider = new MockMicrosoftMfaProvider();

    expect(
      provider.buildAuthorizationUrl({ state: 'signed-state-token' }),
    ).toContain('login.microsoftonline.com/test-tenant/oauth2/v2.0/authorize');
  });

  it('returns the configured identity for a valid mock code', () => {
    const provider = new MockMicrosoftMfaProvider();

    expect(provider.exchangeCodeForIdentity('mock-auth-code')).toEqual({
      providerUserId: 'microsoft-user-1',
      email: 'microsoft.user@example.com',
      name: 'Microsoft User',
      tenantId: 'test-tenant',
    });
  });

  it('accepts the configured MFA verification code', () => {
    const provider = new MockMicrosoftMfaProvider();

    expect(
      provider.verifySecondFactor({
        identity: {
          providerUserId: 'microsoft-user-1',
          email: 'microsoft.user@example.com',
          name: 'Microsoft User',
          tenantId: 'test-tenant',
        },
        verificationCode: '123456',
      }),
    ).toBe(true);
  });
});
