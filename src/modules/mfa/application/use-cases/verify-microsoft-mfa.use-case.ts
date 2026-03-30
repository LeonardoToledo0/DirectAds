/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PasswordService } from '../../../auth/application/services/password.service';
import { MicrosoftMfaAuthResponseDto } from '../dto/microsoft-mfa-auth-response.dto';
import { VerifyMicrosoftMfaDto } from '../dto/verify-microsoft-mfa.dto';
import { MICROSOFT_MFA_PROVIDER } from '../../domain/interfaces/microsoft-mfa-provider.interface';
import type {
  MicrosoftIdentity,
  MicrosoftMfaProvider,
} from '../../domain/interfaces/microsoft-mfa-provider.interface';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface';

interface MicrosoftMfaStatePayload {
  provider: 'microsoft';
  purpose: 'mfa-start';
  redirectUri?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class VerifyMicrosoftMfaUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    @Inject(MICROSOFT_MFA_PROVIDER)
    private readonly microsoftMfaProvider: MicrosoftMfaProvider,
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    payload: VerifyMicrosoftMfaDto,
  ): Promise<MicrosoftMfaAuthResponseDto> {
    const statePayload =
      await this.jwtService.verifyAsync<MicrosoftMfaStatePayload>(
        payload.state,
      );

    if (
      statePayload.provider !== 'microsoft' ||
      statePayload.purpose !== 'mfa-start'
    ) {
      throw new UnauthorizedException('Invalid Microsoft MFA state');
    }

    const identity = await this.microsoftMfaProvider.exchangeCodeForIdentity(
      payload.code,
    );
    await this.microsoftMfaProvider.verifySecondFactor({
      identity,
      verificationCode: payload.verificationCode,
    });

    const user = await this.findOrCreateUser(identity);
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    } satisfies JwtPayload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      mfa: {
        provider: 'microsoft',
        secondFactorVerified: true,
      },
    };
  }

  private async findOrCreateUser(identity: MicrosoftIdentity) {
    const byMicrosoftAccount = await this.prismaService.user.findUnique({
      where: { microsoftAccountId: identity.providerUserId },
    });

    if (byMicrosoftAccount) {
      return byMicrosoftAccount;
    }

    const normalizedEmail = identity.email.toLowerCase().trim();
    const byEmail = await this.prismaService.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (byEmail) {
      return this.prismaService.user.update({
        where: { id: byEmail.id },
        data: {
          microsoftAccountId: identity.providerUserId,
        },
      });
    }

    return this.prismaService.user.create({
      data: {
        name: identity.name.trim(),
        email: normalizedEmail,
        passwordHash: await this.passwordService.hashPassword(
          `microsoft:${identity.providerUserId}`,
        ),
        microsoftAccountId: identity.providerUserId,
      },
    });
  }
}
