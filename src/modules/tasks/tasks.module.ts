import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksController } from './presentation/controllers/tasks.controller';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case';
import { GetTaskByIdUseCase } from './application/use-cases/get-task-by-id.use-case';
import { ListTasksUseCase } from './application/use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case';
import { TASK_REPOSITORY } from './domain/interfaces/task-repository.interface';
import { PrismaTaskRepository } from './infrastructure/repositories/prisma-task.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'directads-dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TasksController],
  providers: [
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
    JwtAuthGuard,
    CreateTaskUseCase,
    ListTasksUseCase,
    GetTaskByIdUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
  ],
  exports: [
    TASK_REPOSITORY,
    CreateTaskUseCase,
    ListTasksUseCase,
    GetTaskByIdUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
  ],
})
export class TasksModule {}
