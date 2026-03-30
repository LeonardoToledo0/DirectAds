process.env.JWT_SECRET = 'test-jwt-secret';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';
import { TaskStatus } from '../src/modules/tasks/domain/entities/task-status.enum';

interface AuthResponseBody {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface TaskResponseBody {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

describe('Tasks endpoints (e2e)', () => {
  let app: INestApplication;
  let users: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  let tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;

  beforeAll(async () => {
    users = [];
    tasks = [];
    const prismaService = {
      enableShutdownHooks: jest.fn(),
      user: {
        findUnique: jest
          .fn()
          .mockImplementation(
            ({ where }: { where: { id?: string; email?: string } }) => {
              if (where.id) {
                return users.find((user) => user.id === where.id) ?? null;
              }

              if (where.email) {
                return users.find((user) => user.email === where.email) ?? null;
              }

              return null;
            },
          ),
        create: jest
          .fn()
          .mockImplementation(
            ({
              data,
            }: {
              data: { name: string; email: string; passwordHash: string };
            }) => {
              const user = {
                id: `user-${users.length + 1}`,
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                createdAt: new Date('2026-03-30T00:00:00.000Z'),
                updatedAt: new Date('2026-03-30T00:00:00.000Z'),
              };
              users.push(user);
              return user;
            },
          ),
      },
      task: {
        create: jest.fn().mockImplementation(
          ({
            data,
          }: {
            data: {
              title: string;
              description?: string;
              status: TaskStatus;
              userId: string;
            };
          }) => {
            const task = {
              id: `task-${tasks.length + 1}`,
              title: data.title,
              description: data.description ?? null,
              status: data.status,
              userId: data.userId,
              createdAt: new Date('2026-03-30T00:00:00.000Z'),
              updatedAt: new Date('2026-03-30T00:00:00.000Z'),
            };
            tasks.push(task);
            return task;
          },
        ),
        findFirst: jest
          .fn()
          .mockImplementation(
            ({ where }: { where: { id: string; userId: string } }) =>
              tasks.find(
                (task) => task.id === where.id && task.userId === where.userId,
              ) ?? null,
          ),
        findMany: jest
          .fn()
          .mockImplementation(
            ({
              where,
            }: {
              where: { userId: string; status?: TaskStatus };
              orderBy: { createdAt: 'desc' };
            }) =>
              [...tasks]
                .filter(
                  (task) =>
                    task.userId === where.userId &&
                    (where.status === undefined ||
                      task.status === where.status),
                )
                .sort(
                  (left, right) =>
                    right.createdAt.getTime() - left.createdAt.getTime(),
                ),
          ),
        update: jest.fn().mockImplementation(
          ({
            where,
            data,
          }: {
            where: { id: string };
            data: {
              title?: string;
              description?: string | null;
              status?: TaskStatus;
            };
          }) => {
            const taskIndex = tasks.findIndex((task) => task.id === where.id);
            const currentTask = tasks[taskIndex];
            const updatedTask = {
              ...currentTask,
              title: data.title ?? currentTask.title,
              description:
                data.description === undefined
                  ? currentTask.description
                  : data.description,
              status: data.status ?? currentTask.status,
              updatedAt: new Date('2026-03-30T01:00:00.000Z'),
            };
            tasks[taskIndex] = updatedTask;
            return updatedTask;
          },
        ),
        delete: jest
          .fn()
          .mockImplementation(({ where }: { where: { id: string } }) => {
            const taskIndex = tasks.findIndex((task) => task.id === where.id);
            const [deletedTask] = tasks.splice(taskIndex, 1);
            return deletedTask;
          }),
      },
    } as unknown as PrismaService;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  beforeEach(() => {
    users = [];
    tasks = [];
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates, lists, reads, updates, filters, and deletes owned tasks', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const firstRegister = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Leona',
        email: 'leona@example.com',
        password: 'secret123',
      });
    const secondRegister = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Mario',
        email: 'mario@example.com',
        password: 'secret123',
      });

    const firstAuth = firstRegister.body as AuthResponseBody;
    const secondAuth = secondRegister.body as AuthResponseBody;

    const createOwnResponse = await request(server)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${firstAuth.accessToken}`)
      .send({
        title: '  Preparar demonstracao  ',
        description: '  Revisar entregaveis  ',
      });
    const ownTask = createOwnResponse.body as TaskResponseBody;

    const createForeignResponse = await request(server)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${secondAuth.accessToken}`)
      .send({
        title: 'Task de outro usuario',
        status: TaskStatus.DONE,
      });

    expect(createOwnResponse.status).toBe(201);
    expect(ownTask.title).toBe('Preparar demonstracao');
    expect(ownTask.description).toBe('Revisar entregaveis');
    expect(ownTask.status).toBe(TaskStatus.TODO);

    const listResponse = await request(server)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${firstAuth.accessToken}`);
    const listBody = listResponse.body as TaskResponseBody[];

    expect(listResponse.status).toBe(200);
    expect(listBody).toHaveLength(1);
    expect(listBody[0].id).toBe(ownTask.id);

    const getOwnResponse = await request(server)
      .get(`/api/tasks/${ownTask.id}`)
      .set('Authorization', `Bearer ${firstAuth.accessToken}`);

    expect(getOwnResponse.status).toBe(200);
    expect((getOwnResponse.body as TaskResponseBody).id).toBe(ownTask.id);

    const getForeignResponse = await request(server)
      .get(`/api/tasks/${ownTask.id}`)
      .set('Authorization', `Bearer ${secondAuth.accessToken}`);

    expect(getForeignResponse.status).toBe(404);

    const updateResponse = await request(server)
      .patch(`/api/tasks/${ownTask.id}`)
      .set('Authorization', `Bearer ${firstAuth.accessToken}`)
      .send({
        status: TaskStatus.IN_PROGRESS,
        description: null,
      });
    const updatedTask = updateResponse.body as TaskResponseBody;

    expect(updateResponse.status).toBe(200);
    expect(updatedTask.status).toBe(TaskStatus.IN_PROGRESS);
    expect(updatedTask.description).toBeNull();

    const filterResponse = await request(server)
      .get('/api/tasks')
      .query({ status: TaskStatus.IN_PROGRESS })
      .set('Authorization', `Bearer ${firstAuth.accessToken}`);

    expect(filterResponse.status).toBe(200);
    expect(filterResponse.body as TaskResponseBody[]).toHaveLength(1);
    expect(createForeignResponse.status).toBe(201);

    const unauthorizedCreate = await request(server)
      .post('/api/tasks')
      .send({ title: 'Sem token' });

    expect(unauthorizedCreate.status).toBe(401);

    const deleteResponse = await request(server)
      .delete(`/api/tasks/${ownTask.id}`)
      .set('Authorization', `Bearer ${firstAuth.accessToken}`);

    expect(deleteResponse.status).toBe(200);
    expect((deleteResponse.body as TaskResponseBody).id).toBe(ownTask.id);

    const getAfterDelete = await request(server)
      .get(`/api/tasks/${ownTask.id}`)
      .set('Authorization', `Bearer ${firstAuth.accessToken}`);

    expect(getAfterDelete.status).toBe(404);
  });
});
