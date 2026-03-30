import 'reflect-metadata';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { AppModule } from './app.module';
import { HealthModule } from './modules/health/health.module';

describe('AppModule', () => {
  it('imports the health module', () => {
    const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, AppModule) as
      | unknown[]
      | undefined;

    expect(imports).toEqual([HealthModule]);
  });
});
