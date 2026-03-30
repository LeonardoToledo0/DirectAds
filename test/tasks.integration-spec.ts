import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { CreateTaskUseCase } from '../src/modules/tasks/application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../src/modules/tasks/application/use-cases/delete-task.use-case';
import { GetTaskByIdUseCase } from '../src/modules/tasks/application/use-cases/get-task-by-id.use-case';
import { ListTasksUseCase } from '../src/modules/tasks/application/use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from '../src/modules/tasks/application/use-cases/update-task.use-case';

describe('Tasks module integration', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('wires all task use cases through the module graph', () => {
    expect(moduleRef.get(CreateTaskUseCase)).toBeDefined();
    expect(moduleRef.get(ListTasksUseCase)).toBeDefined();
    expect(moduleRef.get(GetTaskByIdUseCase)).toBeDefined();
    expect(moduleRef.get(UpdateTaskUseCase)).toBeDefined();
    expect(moduleRef.get(DeleteTaskUseCase)).toBeDefined();
  });
});
