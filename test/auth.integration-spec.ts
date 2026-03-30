import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthController } from '../src/modules/auth/presentation/controllers/auth.controller';

describe('Auth module integration', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
  });

  it('wires the auth controller through the module graph', () => {
    expect(controller).toBeDefined();
  });

  it('exposes the password change endpoint on the auth controller', () => {
    expect(typeof controller.changePassword).toBe('function');
  });
});
