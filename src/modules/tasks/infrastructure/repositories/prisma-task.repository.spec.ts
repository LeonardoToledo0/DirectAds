import { PrismaService } from '../../../../prisma/prisma.service';
import { TaskStatus } from '../../domain/entities/task-status.enum';
import { PrismaTaskRepository } from './prisma-task.repository';

describe('PrismaTaskRepository', () => {
  const taskRecord = {
    id: 'task-1',
    title: 'Preparar entrega',
    description: 'Executar a checklist final',
    status: TaskStatus.TODO,
    userId: 'user-1',
    createdAt: new Date('2026-03-30T00:00:00.000Z'),
    updatedAt: new Date('2026-03-30T01:00:00.000Z'),
  };

  it('creates a task through Prisma', async () => {
    const prismaService = {
      task: {
        create: jest.fn().mockResolvedValue(taskRecord),
      },
    } as unknown as PrismaService;
    const repository = new PrismaTaskRepository(prismaService);

    await expect(
      repository.create({
        title: taskRecord.title,
        description: taskRecord.description ?? undefined,
        status: taskRecord.status,
        userId: taskRecord.userId,
      }),
    ).resolves.toEqual(taskRecord);
  });

  it('returns null when an owned task is not found', async () => {
    const prismaService = {
      task: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;
    const repository = new PrismaTaskRepository(prismaService);

    await expect(
      repository.findByIdForOwner('task-1', 'user-1'),
    ).resolves.toBeNull();
  });

  it('lists tasks using owner and optional status filter', async () => {
    const findMany = jest.fn().mockResolvedValue([taskRecord]);
    const prismaService = {
      task: {
        findMany,
      },
    } as unknown as PrismaService;
    const repository = new PrismaTaskRepository(prismaService);

    await expect(
      repository.listByOwner('user-1', { status: TaskStatus.TODO }),
    ).resolves.toEqual([taskRecord]);
    expect(findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        status: TaskStatus.TODO,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('updates a task through Prisma', async () => {
    const update = jest.fn().mockResolvedValue({
      ...taskRecord,
      title: 'Atualizar entrega',
      status: TaskStatus.DONE,
      description: null,
    });
    const prismaService = {
      task: {
        update,
      },
    } as unknown as PrismaService;
    const repository = new PrismaTaskRepository(prismaService);

    await expect(
      repository.update({
        id: 'task-1',
        title: 'Atualizar entrega',
        description: null,
        status: TaskStatus.DONE,
      }),
    ).resolves.toEqual({
      ...taskRecord,
      title: 'Atualizar entrega',
      description: null,
      status: TaskStatus.DONE,
    });
  });

  it('deletes a task through Prisma', async () => {
    const prismaService = {
      task: {
        delete: jest.fn().mockResolvedValue(taskRecord),
      },
    } as unknown as PrismaService;
    const repository = new PrismaTaskRepository(prismaService);

    await expect(repository.delete('task-1')).resolves.toEqual(taskRecord);
  });
});
