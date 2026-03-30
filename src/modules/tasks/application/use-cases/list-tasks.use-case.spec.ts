import { ListTasksUseCase } from './list-tasks.use-case';
import { TaskStatus } from '../../domain/entities/task-status.enum';
import type { TaskRepository } from '../../domain/interfaces/task-repository.interface';

describe('ListTasksUseCase', () => {
  it('lists tasks for the informed owner without filters', async () => {
    const listByOwner = jest.fn().mockResolvedValue(['task-1']);
    const taskRepository = {
      listByOwner,
    } as unknown as TaskRepository;
    const useCase = new ListTasksUseCase(taskRepository);

    await expect(useCase.execute('user-1')).resolves.toEqual(['task-1']);
    expect(listByOwner).toHaveBeenCalledWith('user-1', undefined);
  });

  it('forwards query filters to the repository', async () => {
    const listByOwner = jest.fn().mockResolvedValue(['task-1']);
    const taskRepository = {
      listByOwner,
    } as unknown as TaskRepository;
    const useCase = new ListTasksUseCase(taskRepository);

    await useCase.execute('user-1', { status: TaskStatus.DONE });

    expect(listByOwner).toHaveBeenCalledWith('user-1', {
      status: TaskStatus.DONE,
    });
  });
});
