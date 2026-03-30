import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@localhost:5432/directads?schema=public';
  });

  afterAll(() => {
    process.env.DATABASE_URL = originalDatabaseUrl;
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('creates a Prisma client configured with the database url from the environment', () => {
    const service = new PrismaService();

    expect(service).toBeDefined();
    expect(typeof service.$connect).toBe('function');
  });

  it('skips connecting automatically while tests are running', async () => {
    process.env.NODE_ENV = 'test';

    const service = new PrismaService();
    const connectSpy = jest
      .spyOn(service, '$connect')
      .mockResolvedValue(undefined as never);

    await service.onModuleInit();

    expect(connectSpy).not.toHaveBeenCalled();
  });

  it('connects on module init outside the test environment', async () => {
    process.env.NODE_ENV = 'development';

    const service = new PrismaService();
    const connectSpy = jest
      .spyOn(service, '$connect')
      .mockResolvedValue(undefined as never);

    await service.onModuleInit();

    expect(connectSpy).toHaveBeenCalledTimes(1);
  });

  it('registers a shutdown hook that closes the Nest application', async () => {
    const service = new PrismaService();
    const close = jest.fn().mockResolvedValue(undefined);
    const app = { close } as unknown as Parameters<
      PrismaService['enableShutdownHooks']
    >[0];
    const onceSpy = jest.spyOn(process, 'once').mockImplementation(((
      event: string,
      listener: () => void,
    ) => {
      if (event === 'beforeExit') {
        listener();
      }

      return process;
    }) as typeof process.once);

    service.enableShutdownHooks(app);
    await Promise.resolve();

    expect(close).toHaveBeenCalledTimes(1);
    expect(onceSpy).toHaveBeenCalledTimes(1);
  });
});
