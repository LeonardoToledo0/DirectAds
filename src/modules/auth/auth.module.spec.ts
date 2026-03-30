import 'reflect-metadata';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { AuthModule } from './auth.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';

describe('AuthModule', () => {
  it('registers the auth controller', () => {
    const controllers = Reflect.getMetadata(
      MODULE_METADATA.CONTROLLERS,
      AuthModule,
    ) as unknown[] | undefined;

    expect(controllers).toEqual([AuthController]);
  });

  it('registers the password change use case provider', () => {
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      AuthModule,
    ) as unknown[] | undefined;

    expect(providers).toContain(ChangePasswordUseCase);
  });
});
