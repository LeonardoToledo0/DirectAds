import { OtplibTotpProvider } from './otplib-totp.provider';
import { generateTotpToken } from './totp.utils';

describe('OtplibTotpProvider', () => {
  it('generates a secret, an otpauth url, and validates a token', async () => {
    process.env.TOTP_APP_NAME = 'DirectAds';
    const provider = new OtplibTotpProvider();
    const secret = provider.generateSecret();
    const otpauthUrl = provider.buildOtpAuthUrl('leona@example.com', secret);
    const qrCodeDataUrl = await provider.generateQrCodeDataUrl(otpauthUrl);
    const token = generateTotpToken(secret);

    expect(secret).toEqual(expect.any(String));
    expect(otpauthUrl).toContain('otpauth://totp/');
    expect(qrCodeDataUrl).toContain('data:image/png;base64,');
    expect(provider.verifyToken(token, secret)).toBe(true);
  });
});
