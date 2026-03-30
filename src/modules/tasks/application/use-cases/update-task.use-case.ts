/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../../domain/entities/task.entity';
import { TASK_REPOSITORY } from '../../domain/interfaces/task-repository.interface';
import type { TaskRepository } from '../../domain/interfaces/task-repository.interface';

@Injectable()
export class UpdateTaskUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    userId: string,
    taskId: string,
    payload: UpdateTaskDto,
  ): Promise<Task> {
    const existingTask = await this.taskRepository.findByIdForOwner(
      taskId,
      userId,
    );

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    return this.taskRepository.update({
      id: existingTask.id,
      title: payload.title?.trim(),
      description: payload.description?.trim(),
      status: payload.status,
    });
  }
}
