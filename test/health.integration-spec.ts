import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HealthController } from '../src/modules/health/presentation/controllers/health.controller';

describe('Health module integration', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = moduleRef.get<HealthController>(HealthController);
  });

  it('wires the health controller through the module graph', () => {
    const result = controller.getStatus();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('directads-backend');
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});
