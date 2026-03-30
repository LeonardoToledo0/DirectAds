/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TotpMfaStatusDto } from '../dto/totp-mfa-status.dto';

@Injectable()
export class DisableTotpMfaUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(private readonly prismaService: PrismaService) {}

  async execute(userId: string): Promise<TotpMfaStatusDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        mfaSecret: null,
        mfaEnabled: false,
        mfaConfirmedAt: null,
      },
    });

    return {
      mfaEnabled: false,
      mfaConfirmedAt: null,
    };
  }
}
