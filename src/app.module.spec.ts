import 'reflect-metadata';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { AppModule } from './app.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { MfaModule } from './modules/mfa/mfa.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PrismaModule } from './prisma/prisma.module';

describe('AppModule', () => {
  it('imports the prisma, health, auth, tasks, and mfa modules', () => {
    const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, AppModule) as
      | unknown[]
      | undefined;

    expect(imports).toEqual([
      PrismaModule,
      HealthModule,
      AuthModule,
      TasksModule,
      MfaModule,
    ]);
  });
});
