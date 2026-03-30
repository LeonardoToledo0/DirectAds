import { NotFoundException } from '@nestjs/common';
import { UpdateTaskUseCase } from './update-task.use-case';
import { TaskStatus } from '../../domain/entities/task-status.enum';
import type { TaskRepository } from '../../domain/interfaces/task-repository.interface';

describe('UpdateTaskUseCase', () => {
  it('updates a task after verifying ownership', async () => {
    const findByIdForOwner = jest.fn().mockResolvedValue({ id: 'task-1' });
    const update = jest.fn().mockResolvedValue('updated-task');
    const taskRepository = {
      findByIdForOwner,
      update,
    } as unknown as TaskRepository;
    const useCase = new UpdateTaskUseCase(taskRepository);

    await expect(
      useCase.execute('user-1', 'task-1', {
        title: '  Ajustar docs  ',
        description: '  Refinar README  ',
        status: TaskStatus.DONE,
      }),
    ).resolves.toBe('updated-task');

    expect(findByIdForOwner).toHaveBeenCalledWith('task-1', 'user-1');
    expect(update).toHaveBeenCalledWith({
      id: 'task-1',
      title: 'Ajustar docs',
      description: 'Refinar README',
      status: TaskStatus.DONE,
    });
  });

  it('throws when the task is not found for the owner', async () => {
    const findByIdForOwner = jest.fn().mockResolvedValue(null);
    const update = jest.fn();
    const taskRepository = {
      findByIdForOwner,
      update,
    } as unknown as TaskRepository;
    const useCase = new UpdateTaskUseCase(taskRepository);

    await expect(useCase.execute('user-1', 'task-1', {})).rejects.toThrow(
      new NotFoundException('Task not found'),
    );
    expect(update).not.toHaveBeenCalled();
  });
});
