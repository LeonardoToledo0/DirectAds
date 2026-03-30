import { Injectable } from '@nestjs/common';
import { HealthStatus } from '../../domain/entities/health-status.entity';

@Injectable()
export class GetHealthStatusUseCase {
  execute(): HealthStatus {
    return {
      status: 'ok',
      service: 'directads-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
