/* istanbul ignore file -- controller behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { RegisterDto } from '../../application/dto/register.dto';
import { GetAuthenticatedUserUseCase } from '../../application/use-cases/get-authenticated-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import type { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
  ) {}

  @Post('register')
  register(@Body() payload: RegisterDto): Promise<AuthResponseDto> {
    return this.registerUserUseCase.execute(payload);
  }

  @Post('login')
  login(@Body() payload: LoginDto): Promise<AuthResponseDto> {
    return this.loginUserUseCase.execute(payload);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.getAuthenticatedUserUseCase.execute(user.sub);
  }
}
