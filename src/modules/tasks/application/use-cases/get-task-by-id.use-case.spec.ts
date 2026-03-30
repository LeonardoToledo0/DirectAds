import { NotFoundException } from '@nestjs/common';
import { GetTaskByIdUseCase } from './get-task-by-id.use-case';
import type { TaskRepository } from '../../domain/interfaces/task-repository.interface';

describe('GetTaskByIdUseCase', () => {
  it('returns the owned task when found', async () => {
    const findByIdForOwner = jest.fn().mockResolvedValue('task-1');
    const taskRepository = {
      findByIdForOwner,
    } as unknown as TaskRepository;
    const useCase = new GetTaskByIdUseCase(taskRepository);

    await expect(useCase.execute('user-1', 'task-1')).resolves.toBe('task-1');
    expect(findByIdForOwner).toHaveBeenCalledWith('task-1', 'user-1');
  });

  it('throws when the task does not belong to the owner or does not exist', async () => {
    const findByIdForOwner = jest.fn().mockResolvedValue(null);
    const taskRepository = {
      findByIdForOwner,
    } as unknown as TaskRepository;
    const useCase = new GetTaskByIdUseCase(taskRepository);

    await expect(useCase.execute('user-1', 'task-1')).rejects.toThrow(
      new NotFoundException('Task not found'),
    );
  });
});
