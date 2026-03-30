import {
  buildOtpAuthUrl,
  generateBase32Secret,
  generateTotpToken,
  verifyTotpToken,
} from './totp.utils';

describe('totp.utils', () => {
  it('generates a base32 secret and builds the otpauth URL', () => {
    const secret = generateBase32Secret(10);
    const url = buildOtpAuthUrl('leona@example.com', secret, 'DirectAds');

    expect(secret).toMatch(/^[A-Z2-7]+$/u);
    expect(url).toBe(
      `otpauth://totp/DirectAds%3Aleona%40example.com?secret=${secret}&issuer=DirectAds&period=30&digits=6`,
    );
  });

  it('generates and verifies a valid totp token', () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const epochMs = 1_711_756_800_000;
    const token = generateTotpToken(secret, epochMs);

    expect(token).toHaveLength(6);
    expect(verifyTotpToken(token, secret, 1, epochMs)).toBe(true);
  });

  it('returns false for an invalid token', () => {
    expect(
      verifyTotpToken('000000', 'JBSWY3DPEHPK3PXP', 1, 1_711_756_800_000),
    ).toBe(false);
  });

  it('throws for an invalid base32 secret', () => {
    expect(() => generateTotpToken('invalid-secret')).toThrow(
      'Invalid base32 secret',
    );
  });
});
