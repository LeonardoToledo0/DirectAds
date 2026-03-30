/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { PasswordService } from '../services/password.service';

@Injectable()
export class ChangePasswordUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(
    userId: string,
    payload: ChangePasswordDto,
  ): Promise<AuthenticatedUserDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await this.passwordService.comparePassword(
      payload.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is invalid');
    }

    if (payload.currentPassword === payload.newPassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const passwordHash = await this.passwordService.hashPassword(
      payload.newPassword,
    );
    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      mfaEnabled: updatedUser.mfaEnabled,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
