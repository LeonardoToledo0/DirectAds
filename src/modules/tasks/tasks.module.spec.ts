import 'reflect-metadata';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case';
import { GetTaskByIdUseCase } from './application/use-cases/get-task-by-id.use-case';
import { ListTasksUseCase } from './application/use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case';
import { TASK_REPOSITORY } from './domain/interfaces/task-repository.interface';
import { PrismaTaskRepository } from './infrastructure/repositories/prisma-task.repository';
import { TasksController } from './presentation/controllers/tasks.controller';
import { TasksModule } from './tasks.module';

describe('TasksModule', () => {
  it('registers the tasks controller', () => {
    const controllers = Reflect.getMetadata(
      MODULE_METADATA.CONTROLLERS,
      TasksModule,
    ) as unknown[] | undefined;

    expect(controllers).toEqual([TasksController]);
  });

  it('registers repository and use cases', () => {
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      TasksModule,
    ) as unknown[] | undefined;

    expect(providers).toEqual([
      {
        provide: TASK_REPOSITORY,
        useClass: PrismaTaskRepository,
      },
      expect.any(Function),
      CreateTaskUseCase,
      ListTasksUseCase,
      GetTaskByIdUseCase,
      UpdateTaskUseCase,
      DeleteTaskUseCase,
    ]);
  });
});
