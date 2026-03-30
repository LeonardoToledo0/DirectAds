import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

interface HealthResponse {
  status: 'ok';
  service: string;
  timestamp: string;
}

describe('Health endpoint (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/health (GET)', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).get('/api/health');
    const body = response.body as HealthResponse;

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.service).toBe('directads-backend');
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });
});
