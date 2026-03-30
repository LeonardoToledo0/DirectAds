import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../src/app.setup';
import { AppModule } from '../src/app.module';

interface HealthResponse {
  status: 'ok';
  service: string;
  timestamp: string;
}

interface OpenApiResponse {
  paths: Record<string, unknown>;
  components?: {
    securitySchemes?: Record<string, unknown>;
  };
}

describe('Health endpoint (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
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

  it('/api/docs (GET)', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).get('/api/docs');

    expect(response.status).toBe(200);
    expect(response.text).toContain('swagger-ui');
  });

  it('/api/docs-json (GET)', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).get('/api/docs-json');
    const body = response.body as OpenApiResponse;

    expect(response.status).toBe(200);
    expect(body.paths['/api/health']).toBeDefined();
    expect(body.paths['/api/auth/register']).toBeDefined();
    expect(body.paths['/api/auth/login']).toBeDefined();
    expect(body.paths['/api/auth/me']).toBeDefined();
    expect(body.paths['/api/tasks']).toBeDefined();
    expect(body.paths['/api/tasks/{taskId}']).toBeDefined();
    expect(body.paths['/api/mfa/setup']).toBeDefined();
    expect(body.paths['/api/mfa/enable']).toBeDefined();
    expect(body.paths['/api/mfa/verify-login']).toBeDefined();
    expect(body.components?.securitySchemes?.bearer).toBeDefined();
  });
});
