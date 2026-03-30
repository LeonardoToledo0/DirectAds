import { Test, TestingModule } from '@nestjs/testing';
import { GetHealthStatusUseCase } from '../../application/use-cases/get-health-status.use-case';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [GetHealthStatusUseCase],
    }).compile();

    controller = moduleRef.get<HealthController>(HealthController);
  });

  it('returns the health payload from the use case', () => {
    const result = controller.getStatus();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('directads-backend');
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});
