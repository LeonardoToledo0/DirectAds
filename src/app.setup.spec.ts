import { INestApplication } from '@nestjs/common';
import { configureApp } from './app.setup';
import { PrismaService } from './prisma/prisma.service';

describe('configureApp', () => {
  it('configures prefix, validation, and prisma shutdown hooks', () => {
    const enableShutdownHooks = jest.fn();
    const prismaService = {
      enableShutdownHooks,
    } as unknown as PrismaService;
    const get = jest.fn().mockReturnValue(prismaService);
    const setGlobalPrefix = jest.fn();
    const useGlobalPipes = jest.fn();
    const app = {
      get,
      setGlobalPrefix,
      useGlobalPipes,
    } as unknown as INestApplication;

    configureApp(app);

    expect(get).toHaveBeenCalledWith(PrismaService);
    expect(setGlobalPrefix).toHaveBeenCalledWith('api');
    expect(useGlobalPipes).toHaveBeenCalledTimes(1);
    expect(enableShutdownHooks).toHaveBeenCalledWith(app);
  });
});
