/* istanbul ignore file -- thin Nest controller; behavior is covered through unit and e2e tests */
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetHealthStatusUseCase } from '../../application/use-cases/get-health-status.use-case';
import type { HealthStatus } from '../../domain/entities/health-status.entity';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly getHealthStatusUseCase: GetHealthStatusUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Verificar o healthcheck da aplicação' })
  @ApiOkResponse({
    description: 'Aplicação disponível',
    schema: {
      example: {
        status: 'ok',
        service: 'directads-backend',
        timestamp: '2026-03-30T00:00:00.000Z',
      },
    },
  })
  getStatus(): HealthStatus {
    return this.getHealthStatusUseCase.execute();
  }
}
