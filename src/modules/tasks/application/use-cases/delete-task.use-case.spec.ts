import { NotFoundException } from '@nestjs/common';
import { DeleteTaskUseCase } from './delete-task.use-case';
import type { TaskRepository } from '../../domain/interfaces/task-repository.interface';

describe('DeleteTaskUseCase', () => {
  it('deletes a task after verifying ownership', async () => {
    const findByIdForOwner = jest.fn().mockResolvedValue({ id: 'task-1' });
    const remove = jest.fn().mockResolvedValue('deleted-task');
    const taskRepository = {
      findByIdForOwner,
      delete: remove,
    } as unknown as TaskRepository;
    const useCase = new DeleteTaskUseCase(taskRepository);

    await expect(useCase.execute('user-1', 'task-1')).resolves.toBe(
      'deleted-task',
    );
    expect(findByIdForOwner).toHaveBeenCalledWith('task-1', 'user-1');
    expect(remove).toHaveBeenCalledWith('task-1');
  });

  it('throws when the task is not found for the owner', async () => {
    const findByIdForOwner = jest.fn().mockResolvedValue(null);
    const remove = jest.fn();
    const taskRepository = {
      findByIdForOwner,
      delete: remove,
    } as unknown as TaskRepository;
    const useCase = new DeleteTaskUseCase(taskRepository);

    await expect(useCase.execute('user-1', 'task-1')).rejects.toThrow(
      new NotFoundException('Task not found'),
    );
    expect(remove).not.toHaveBeenCalled();
  });
});
