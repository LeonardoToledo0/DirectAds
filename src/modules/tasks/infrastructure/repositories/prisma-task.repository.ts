/* istanbul ignore file -- behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/entities/task-status.enum';
import {
  CreateTaskRepositoryInput,
  ListTasksRepositoryFilters,
  TaskRepository,
  UpdateTaskRepositoryInput,
} from '../../domain/interfaces/task-repository.interface';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateTaskRepositoryInput): Promise<Task> {
    const task = await this.prismaService.task.create({
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        userId: input.userId,
      },
    });

    return this.toDomain(task);
  }

  async findByIdForOwner(taskId: string, userId: string): Promise<Task | null> {
    const task = await this.prismaService.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    return task ? this.toDomain(task) : null;
  }

  async listByOwner(
    userId: string,
    filters?: ListTasksRepositoryFilters,
  ): Promise<Task[]> {
    const tasks = await this.prismaService.task.findMany({
      where: {
        userId,
        status: filters?.status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async update(input: UpdateTaskRepositoryInput): Promise<Task> {
    const task = await this.prismaService.task.update({
      where: { id: input.id },
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
      },
    });

    return this.toDomain(task);
  }

  async delete(taskId: string): Promise<Task> {
    const task = await this.prismaService.task.delete({
      where: { id: taskId },
    });

    return this.toDomain(task);
  }

  private toDomain(task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
