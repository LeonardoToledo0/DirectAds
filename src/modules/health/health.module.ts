import { Module } from '@nestjs/common';
import { GetHealthStatusUseCase } from './application/use-cases/get-health-status.use-case';
import { HealthController } from './presentation/controllers/health.controller';

@Module({
  controllers: [HealthController],
  providers: [GetHealthStatusUseCase],
})
export class HealthModule {}
