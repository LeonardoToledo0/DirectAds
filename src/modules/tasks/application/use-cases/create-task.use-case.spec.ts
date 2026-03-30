import { CreateTaskUseCase } from './create-task.use-case';
import { TaskStatus } from '../../domain/entities/task-status.enum';
import type { TaskRepository } from '../../domain/interfaces/task-repository.interface';

describe('CreateTaskUseCase', () => {
  it('creates a task with normalized input and default status', async () => {
    const create = jest.fn().mockResolvedValue('created-task');
    const taskRepository = {
      create,
    } as unknown as TaskRepository;
    const useCase = new CreateTaskUseCase(taskRepository);

    await expect(
      useCase.execute('user-1', {
        title: '  Preparar entrevista  ',
        description: '  Revisar fluxo JWT  ',
      }),
    ).resolves.toBe('created-task');

    expect(create).toHaveBeenCalledWith({
      title: 'Preparar entrevista',
      description: 'Revisar fluxo JWT',
      status: TaskStatus.TODO,
      userId: 'user-1',
    });
  });

  it('preserves the provided status', async () => {
    const create = jest.fn().mockResolvedValue('created-task');
    const taskRepository = {
      create,
    } as unknown as TaskRepository;
    const useCase = new CreateTaskUseCase(taskRepository);

    await useCase.execute('user-1', {
      title: 'Executar validacoes',
      status: TaskStatus.IN_PROGRESS,
    });

    expect(create).toHaveBeenCalledWith({
      title: 'Executar validacoes',
      description: undefined,
      status: TaskStatus.IN_PROGRESS,
      userId: 'user-1',
    });
  });
});
