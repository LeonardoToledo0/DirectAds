import 'reflect-metadata';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { AuthModule } from './auth.module';
import { AuthController } from './presentation/controllers/auth.controller';

describe('AuthModule', () => {
  it('registers the auth controller', () => {
    const controllers = Reflect.getMetadata(
      MODULE_METADATA.CONTROLLERS,
      AuthModule,
    ) as unknown[] | undefined;

    expect(controllers).toEqual([AuthController]);
  });
});
