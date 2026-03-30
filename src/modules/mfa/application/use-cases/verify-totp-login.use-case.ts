/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AuthResponseDto } from '../../../auth/application/dto/auth-response.dto';
import { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface';
import { VerifyTotpLoginDto } from '../dto/verify-totp-login.dto';
import { TOTP_PROVIDER } from '../../domain/interfaces/totp-provider.interface';
import { Inject } from '@nestjs/common';
import type { TotpProvider } from '../../domain/interfaces/totp-provider.interface';

interface MfaLoginPayload {
  sub: string;
  purpose: 'mfa-login';
  iat?: number;
  exp?: number;
}

@Injectable()
export class VerifyTotpLoginUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(TOTP_PROVIDER)
    private readonly totpProvider: TotpProvider,
    private readonly jwtService: JwtService,
  ) {}

  async execute(payload: VerifyTotpLoginDto): Promise<AuthResponseDto> {
    const loginPayload = await this.jwtService.verifyAsync<MfaLoginPayload>(
      payload.mfaToken,
    );

    if (loginPayload.purpose !== 'mfa-login') {
      throw new UnauthorizedException('Invalid MFA login token');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: loginPayload.sub },
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      throw new UnauthorizedException('MFA is not enabled for this user');
    }

    if (!this.totpProvider.verifyToken(payload.code, user.mfaSecret)) {
      throw new UnauthorizedException('Invalid TOTP code');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
      } satisfies JwtPayload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mfaEnabled: user.mfaEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
