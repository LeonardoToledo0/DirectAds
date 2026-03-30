import 'reflect-metadata';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { GetHealthStatusUseCase } from './application/use-cases/get-health-status.use-case';
import { HealthModule } from './health.module';
import { HealthController } from './presentation/controllers/health.controller';

describe('HealthModule', () => {
  it('registers the expected controller and provider', () => {
    const controllers = Reflect.getMetadata(
      MODULE_METADATA.CONTROLLERS,
      HealthModule,
    ) as unknown[] | undefined;
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      HealthModule,
    ) as unknown[] | undefined;

    expect(controllers).toEqual([HealthController]);
    expect(providers).toEqual([GetHealthStatusUseCase]);
  });
});
