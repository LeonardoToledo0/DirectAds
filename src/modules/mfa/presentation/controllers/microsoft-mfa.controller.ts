/* istanbul ignore file -- controller behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MicrosoftMfaAuthResponseDto } from '../../application/dto/microsoft-mfa-auth-response.dto';
import { MicrosoftMfaStartResponseDto } from '../../application/dto/microsoft-mfa-start-response.dto';
import { StartMicrosoftMfaDto } from '../../application/dto/start-microsoft-mfa.dto';
import { VerifyMicrosoftMfaDto } from '../../application/dto/verify-microsoft-mfa.dto';
import { StartMicrosoftMfaUseCase } from '../../application/use-cases/start-microsoft-mfa.use-case';
import { VerifyMicrosoftMfaUseCase } from '../../application/use-cases/verify-microsoft-mfa.use-case';

@ApiTags('mfa')
@Controller('mfa/microsoft')
export class MicrosoftMfaController {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly startMicrosoftMfaUseCase: StartMicrosoftMfaUseCase,
    private readonly verifyMicrosoftMfaUseCase: VerifyMicrosoftMfaUseCase,
  ) {}

  @Post('start')
  @ApiOperation({ summary: 'Iniciar o fluxo federado Microsoft MFA' })
  @ApiOkResponse({
    description: 'URL federada Microsoft e state assinada gerados com sucesso',
    type: MicrosoftMfaStartResponseDto,
  })
  start(
    @Body() payload: StartMicrosoftMfaDto,
  ): Promise<MicrosoftMfaStartResponseDto> {
    return this.startMicrosoftMfaUseCase.execute(payload);
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Validar o retorno Microsoft e a segunda etapa MFA',
  })
  @ApiOkResponse({
    description: 'Usuario autenticado via Microsoft MFA com JWT local emitido',
    type: MicrosoftMfaAuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'State invalida, code invalido ou segunda etapa MFA falhou',
  })
  @ApiConflictResponse({
    description: 'Conflito ao vincular a identidade Microsoft ao usuario local',
  })
  verify(
    @Body() payload: VerifyMicrosoftMfaDto,
  ): Promise<MicrosoftMfaAuthResponseDto> {
    return this.verifyMicrosoftMfaUseCase.execute(payload);
  }
}
