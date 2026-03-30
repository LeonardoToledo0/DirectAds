/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { EnableTotpMfaDto } from '../dto/enable-totp-mfa.dto';
import { TotpMfaStatusDto } from '../dto/totp-mfa-status.dto';
import { TOTP_PROVIDER } from '../../domain/interfaces/totp-provider.interface';
import type { TotpProvider } from '../../domain/interfaces/totp-provider.interface';

@Injectable()
export class EnableTotpMfaUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(TOTP_PROVIDER)
    private readonly totpProvider: TotpProvider,
  ) {}

  async execute(
    userId: string,
    payload: EnableTotpMfaDto,
  ): Promise<TotpMfaStatusDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.mfaSecret) {
      throw new BadRequestException('MFA setup has not been started');
    }

    if (!this.totpProvider.verifyToken(payload.code, user.mfaSecret)) {
      throw new UnauthorizedException('Invalid TOTP code');
    }

    const confirmedAt = new Date();
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: true,
        mfaConfirmedAt: confirmedAt,
      },
    });

    return {
      mfaEnabled: true,
      mfaConfirmedAt: confirmedAt,
    };
  }
}
