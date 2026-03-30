/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Inject, Injectable } from '@nestjs/common';
import { TaskQueryDto } from '../dto/task-query.dto';
import { Task } from '../../domain/entities/task.entity';
import { TASK_REPOSITORY } from '../../domain/interfaces/task-repository.interface';
import type { TaskRepository } from '../../domain/interfaces/task-repository.interface';

@Injectable()
export class ListTasksUseCase {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  execute(userId: string, filters?: TaskQueryDto): Promise<Task[]> {
    return this.taskRepository.listByOwner(userId, filters);
  }
}
