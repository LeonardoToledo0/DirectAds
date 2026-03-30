import 'reflect-metadata';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

describe('PrismaModule', () => {
  it('exports the Prisma service as a global module', () => {
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      PrismaModule,
    ) as unknown[] | undefined;
    const exportsMetadata = Reflect.getMetadata(
      MODULE_METADATA.EXPORTS,
      PrismaModule,
    ) as unknown[] | undefined;
    const isGlobal = Reflect.getMetadata('__module:global__', PrismaModule) as
      | boolean
      | undefined;

    expect(providers).toEqual([PrismaService]);
    expect(exportsMetadata).toEqual([PrismaService]);
    expect(isGlobal).toBe(true);
  });
});
