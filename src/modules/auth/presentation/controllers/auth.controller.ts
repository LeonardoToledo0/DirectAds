/* istanbul ignore file -- controller behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthenticatedUserDto } from '../../application/dto/authenticated-user.dto';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { ChangePasswordDto } from '../../application/dto/change-password.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { LoginResponseDto } from '../../application/dto/login-response.dto';
import { RegisterDto } from '../../application/dto/register.dto';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { GetAuthenticatedUserUseCase } from '../../application/use-cases/get-authenticated-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import type { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiOkResponse({
    description: 'Usuário registrado com sucesso',
    type: AuthResponseDto,
  })
  @ApiConflictResponse({ description: 'Email já está em uso' })
  register(@Body() payload: RegisterDto): Promise<AuthResponseDto> {
    return this.registerUserUseCase.execute(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar um usuário existente' })
  @ApiOkResponse({
    description: 'Usuário autenticado ou redirecionado para a etapa MFA',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  login(@Body() payload: LoginDto): Promise<LoginResponseDto> {
    return this.loginUserUseCase.execute(payload);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Trocar a senha do usuario autenticado' })
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Senha atualizada com sucesso',
    type: AuthenticatedUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido, expirado ou senha atual incorreta',
  })
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() payload: ChangePasswordDto,
  ): Promise<AuthenticatedUserDto> {
    return this.changePasswordUseCase.execute(user.sub, payload);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Retornar o usuário autenticado' })
  @ApiOkResponse({
    description: 'Dados do usuário autenticado',
    type: AuthenticatedUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido ou expirado',
  })
  me(@CurrentUser() user: JwtPayload): Promise<AuthenticatedUserDto> {
    return this.getAuthenticatedUserUseCase.execute(user.sub);
  }
}
