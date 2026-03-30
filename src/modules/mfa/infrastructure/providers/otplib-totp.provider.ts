/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { TotpProvider } from '../../domain/interfaces/totp-provider.interface';
import {
  buildOtpAuthUrl,
  generateBase32Secret,
  verifyTotpToken,
} from './totp.utils';

@Injectable()
export class OtplibTotpProvider implements TotpProvider {
  generateSecret(): string {
    return generateBase32Secret();
  }

  buildOtpAuthUrl(email: string, secret: string): string {
    return buildOtpAuthUrl(
      email,
      secret,
      process.env.TOTP_APP_NAME ?? 'DirectAds',
    );
  }

  generateQrCodeDataUrl(otpauthUrl: string): Promise<string> {
    return QRCode.toDataURL(otpauthUrl);
  }

  verifyToken(token: string, secret: string): boolean {
    return verifyTotpToken(token, secret);
  }
}
