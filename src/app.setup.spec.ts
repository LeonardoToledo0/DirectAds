import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { configureApp } from './app.setup';
import { PrismaService } from './prisma/prisma.service';

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: class {
    setTitle() {
      return this;
    }
    setDescription() {
      return this;
    }
    setVersion() {
      return this;
    }
    addBearerAuth() {
      return this;
    }
    build() {
      return { openapi: '3.0.0' };
    }
  },
  SwaggerModule: {
    createDocument: jest.fn().mockReturnValue({ openapi: '3.0.0' }),
    setup: jest.fn(),
  },
}));

const swaggerModuleMock = SwaggerModule as unknown as {
  createDocument: jest.Mock;
  setup: jest.Mock;
};

describe('configureApp', () => {
  it('configures prefix, validation, swagger, and prisma shutdown hooks', () => {
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
    expect(swaggerModuleMock.createDocument).toHaveBeenCalledTimes(1);
    expect(swaggerModuleMock.setup).toHaveBeenCalledWith(
      'api/docs',
      app,
      expect.objectContaining({ openapi: '3.0.0' }),
    );
    expect(enableShutdownHooks).toHaveBeenCalledWith(app);
  });
});
