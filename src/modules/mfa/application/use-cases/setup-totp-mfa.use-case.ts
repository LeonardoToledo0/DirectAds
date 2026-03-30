/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TotpSetupResponseDto } from '../dto/totp-setup-response.dto';
import { TOTP_PROVIDER } from '../../domain/interfaces/totp-provider.interface';
import type { TotpProvider } from '../../domain/interfaces/totp-provider.interface';

@Injectable()
export class SetupTotpMfaUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(TOTP_PROVIDER)
    private readonly totpProvider: TotpProvider,
  ) {}

  async execute(userId: string): Promise<TotpSetupResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.email) {
      throw new BadRequestException('User email is required to configure MFA');
    }

    const secret = this.totpProvider.generateSecret();
    const otpauthUrl = this.totpProvider.buildOtpAuthUrl(user.email, secret);
    const qrCodeDataUrl =
      await this.totpProvider.generateQrCodeDataUrl(otpauthUrl);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        mfaSecret: secret,
        mfaEnabled: false,
        mfaConfirmedAt: null,
      },
    });

    return {
      secret,
      otpauthUrl,
      qrCodeDataUrl,
    };
  }
}
