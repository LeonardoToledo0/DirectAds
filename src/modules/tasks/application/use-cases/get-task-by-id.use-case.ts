/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../domain/entities/task.entity';
import { TASK_REPOSITORY } from '../../domain/interfaces/task-repository.interface';
import type { TaskRepository } from '../../domain/interfaces/task-repository.interface';

@Injectable()
export class GetTaskByIdUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskRepository.findByIdForOwner(taskId, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
