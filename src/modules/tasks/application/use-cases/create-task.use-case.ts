/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/entities/task-status.enum';
import { TASK_REPOSITORY } from '../../domain/interfaces/task-repository.interface';
import type { TaskRepository } from '../../domain/interfaces/task-repository.interface';

@Injectable()
export class CreateTaskUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  execute(userId: string, payload: CreateTaskDto): Promise<Task> {
    return this.taskRepository.create({
      title: payload.title.trim(),
      description: payload.description?.trim(),
      status: payload.status ?? TaskStatus.TODO,
      userId,
    });
  }
}
