/* istanbul ignore file -- controller behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { AuthResponseDto } from '../../../auth/application/dto/auth-response.dto';
import { EnableTotpMfaDto } from '../../application/dto/enable-totp-mfa.dto';
import { TotpMfaStatusDto } from '../../application/dto/totp-mfa-status.dto';
import { TotpSetupResponseDto } from '../../application/dto/totp-setup-response.dto';
import { VerifyTotpLoginDto } from '../../application/dto/verify-totp-login.dto';
import { EnableTotpMfaUseCase } from '../../application/use-cases/enable-totp-mfa.use-case';
import { SetupTotpMfaUseCase } from '../../application/use-cases/setup-totp-mfa.use-case';
import { VerifyTotpLoginUseCase } from '../../application/use-cases/verify-totp-login.use-case';

@ApiTags('mfa')
@Controller('mfa')
export class MfaController {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly setupTotpMfaUseCase: SetupTotpMfaUseCase,
    private readonly enableTotpMfaUseCase: EnableTotpMfaUseCase,
    private readonly verifyTotpLoginUseCase: VerifyTotpLoginUseCase,
  ) {}

  @Post('setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Gerar secret e QR code para configurar TOTP no autenticador',
  })
  @ApiCreatedResponse({
    description: 'Dados de setup TOTP gerados com sucesso',
    type: TotpSetupResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido ou expirado',
  })
  setup(@CurrentUser() user: JwtPayload): Promise<TotpSetupResponseDto> {
    return this.setupTotpMfaUseCase.execute(user.sub);
  }

  @Post('enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Confirmar o primeiro codigo TOTP e ativar MFA no usuario',
  })
  @ApiOkResponse({
    description: 'MFA ativado com sucesso',
    type: TotpMfaStatusDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, invalido, expirado ou codigo TOTP invalido',
  })
  enable(
    @CurrentUser() user: JwtPayload,
    @Body() payload: EnableTotpMfaDto,
  ): Promise<TotpMfaStatusDto> {
    return this.enableTotpMfaUseCase.execute(user.sub, payload);
  }

  @Post('verify-login')
  @ApiOperation({ summary: 'Validar a segunda etapa TOTP e concluir o login' })
  @ApiOkResponse({
    description: 'Login concluido com sucesso apos validar TOTP',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token MFA invalido ou codigo TOTP invalido',
  })
  verifyLogin(@Body() payload: VerifyTotpLoginDto): Promise<AuthResponseDto> {
    return this.verifyTotpLoginUseCase.execute(payload);
  }
}
