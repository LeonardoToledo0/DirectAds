import { PrismaService } from '../src/prisma/prisma.service';

describe('Prisma configuration integration', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@localhost:5432/directads?schema=public';
  });

  afterAll(() => {
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('instantiates the Prisma service with a PostgreSQL datasource available', () => {
    const service = new PrismaService();

    expect(service).toBeDefined();
    expect(typeof service.$connect).toBe('function');
  });
});
