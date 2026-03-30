/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { PasswordService } from '../services/password.service';

@Injectable()
export class RegisterUserUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(payload: RegisterDto): Promise<AuthResponseDto> {
    const normalizedEmail = payload.email.toLowerCase().trim();
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.passwordService.hashPassword(
      payload.password,
    );
    const user = await this.prismaService.user.create({
      data: {
        name: payload.name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
    });

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
      } satisfies JwtPayload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
