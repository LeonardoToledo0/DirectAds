export const TOTP_PROVIDER = Symbol('TOTP_PROVIDER');

export interface TotpProvider {
  generateSecret(): string;
  buildOtpAuthUrl(email: string, secret: string): string;
  generateQrCodeDataUrl(otpauthUrl: string): Promise<string>;
  verifyToken(token: string, secret: string): boolean;
}
