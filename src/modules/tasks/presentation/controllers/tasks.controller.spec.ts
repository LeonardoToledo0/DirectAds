import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import { GetTaskByIdUseCase } from '../../application/use-cases/get-task-by-id.use-case';
import { ListTasksUseCase } from '../../application/use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case';
import { TaskStatus } from '../../domain/entities/task-status.enum';

describe('TasksController', () => {
  let controller: TasksController;
  let createTaskUseCase: { execute: jest.Mock };
  let listTasksUseCase: { execute: jest.Mock };
  let getTaskByIdUseCase: { execute: jest.Mock };
  let updateTaskUseCase: { execute: jest.Mock };
  let deleteTaskUseCase: { execute: jest.Mock };

  const task = {
    id: 'task-1',
    title: 'Preparar demonstracao',
    description: 'Revisar entregaveis',
    status: TaskStatus.TODO,
    userId: 'user-1',
    createdAt: new Date('2026-03-30T00:00:00.000Z'),
    updatedAt: new Date('2026-03-30T00:00:00.000Z'),
  };

  beforeEach(async () => {
    createTaskUseCase = { execute: jest.fn() };
    listTasksUseCase = { execute: jest.fn() };
    getTaskByIdUseCase = { execute: jest.fn() };
    updateTaskUseCase = { execute: jest.fn() };
    deleteTaskUseCase = { execute: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: CreateTaskUseCase, useValue: createTaskUseCase },
        { provide: ListTasksUseCase, useValue: listTasksUseCase },
        { provide: GetTaskByIdUseCase, useValue: getTaskByIdUseCase },
        { provide: UpdateTaskUseCase, useValue: updateTaskUseCase },
        { provide: DeleteTaskUseCase, useValue: deleteTaskUseCase },
      ],
    }).compile();

    controller = moduleRef.get(TasksController);
  });

  it('creates a task for the authenticated user', async () => {
    createTaskUseCase.execute.mockResolvedValue(task);

    await expect(
      controller.create(
        { sub: 'user-1', email: 'leona@example.com' },
        { title: 'Preparar demonstracao' },
      ),
    ).resolves.toEqual({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  });

  it('lists tasks for the authenticated user', async () => {
    listTasksUseCase.execute.mockResolvedValue([task]);

    await expect(
      controller.list(
        { sub: 'user-1', email: 'leona@example.com' },
        { status: TaskStatus.TODO },
      ),
    ).resolves.toEqual([
      {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    ]);
  });

  it('returns a single task for the authenticated user', async () => {
    getTaskByIdUseCase.execute.mockResolvedValue(task);

    await expect(
      controller.getById(
        { sub: 'user-1', email: 'leona@example.com' },
        'task-1',
      ),
    ).resolves.toEqual({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  });

  it('updates a task for the authenticated user', async () => {
    updateTaskUseCase.execute.mockResolvedValue({
      ...task,
      status: TaskStatus.DONE,
    });

    await expect(
      controller.update(
        { sub: 'user-1', email: 'leona@example.com' },
        'task-1',
        { status: TaskStatus.DONE },
      ),
    ).resolves.toEqual({
      id: task.id,
      title: task.title,
      description: task.description,
      status: TaskStatus.DONE,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  });

  it('deletes a task for the authenticated user', async () => {
    deleteTaskUseCase.execute.mockResolvedValue(task);

    await expect(
      controller.delete(
        { sub: 'user-1', email: 'leona@example.com' },
        'task-1',
      ),
    ).resolves.toEqual({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  });
});
