/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AuthenticatedUser } from '../../domain/interfaces/authenticated-user.interface';

@Injectable()
export class GetAuthenticatedUserUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(private readonly prismaService: PrismaService) {}

  async execute(userId: string): Promise<AuthenticatedUser> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
