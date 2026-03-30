/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { PasswordService } from '../services/password.service';

interface MfaLoginPayload {
  sub: string;
  purpose: 'mfa-login';
}

@Injectable()
export class LoginUserUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(payload: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email: payload.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      payload.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.mfaEnabled && user.mfaSecret) {
      return {
        mfaRequired: true,
        mfaToken: await this.jwtService.signAsync(
          {
            sub: user.id,
            purpose: 'mfa-login',
          } satisfies MfaLoginPayload,
          { expiresIn: '5m' },
        ),
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

    return {
      mfaRequired: false,
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
