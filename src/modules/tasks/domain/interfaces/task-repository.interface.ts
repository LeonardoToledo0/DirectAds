import { Task } from '../entities/task.entity';
import { TaskStatus } from '../entities/task-status.enum';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface CreateTaskRepositoryInput {
  title: string;
  description?: string;
  status: TaskStatus;
  userId: string;
}

export interface UpdateTaskRepositoryInput {
  id: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
}

export interface ListTasksRepositoryFilters {
  status?: TaskStatus;
}

export interface TaskRepository {
  create(input: CreateTaskRepositoryInput): Promise<Task>;
  findByIdForOwner(taskId: string, userId: string): Promise<Task | null>;
  listByOwner(
    userId: string,
    filters?: ListTasksRepositoryFilters,
  ): Promise<Task[]>;
  update(input: UpdateTaskRepositoryInput): Promise<Task>;
  delete(taskId: string): Promise<Task>;
}
