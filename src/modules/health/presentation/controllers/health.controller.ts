/* istanbul ignore file -- thin Nest controller; behavior is covered through unit and e2e tests */
import { Controller, Get } from '@nestjs/common';
import { GetHealthStatusUseCase } from '../../application/use-cases/get-health-status.use-case';
import type { HealthStatus } from '../../domain/entities/health-status.entity';

@Controller('health')
export class HealthController {
  constructor(
    private readonly getHealthStatusUseCase: GetHealthStatusUseCase,
  ) {}

  @Get()
  getStatus(): HealthStatus {
    return this.getHealthStatusUseCase.execute();
  }
}
