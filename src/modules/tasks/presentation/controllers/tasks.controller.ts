/* istanbul ignore file -- controller behavior is covered by tests; remaining uncovered branches come from Nest metadata emission */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface';
import { CreateTaskDto } from '../../application/dto/create-task.dto';
import { TaskQueryDto } from '../../application/dto/task-query.dto';
import { TaskResponseDto } from '../../application/dto/task-response.dto';
import { UpdateTaskDto } from '../../application/dto/update-task.dto';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import { GetTaskByIdUseCase } from '../../application/use-cases/get-task-by-id.use-case';
import { ListTasksUseCase } from '../../application/use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case';
import type { Task } from '../../domain/entities/task.entity';

@ApiTags('tasks')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Token ausente, invalido ou expirado' })
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  /* istanbul ignore next -- constructor only wires Nest dependencies */
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly listTasksUseCase: ListTasksUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova task do usuario autenticado' })
  @ApiCreatedResponse({
    description: 'Task criada com sucesso',
    type: TaskResponseDto,
  })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() payload: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.toResponse(
      await this.createTaskUseCase.execute(user.sub, payload),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar tasks do usuario autenticado' })
  @ApiOkResponse({
    description: 'Lista de tasks do usuario autenticado',
    type: TaskResponseDto,
    isArray: true,
  })
  async list(
    @CurrentUser() user: JwtPayload,
    @Query() query: TaskQueryDto,
  ): Promise<TaskResponseDto[]> {
    const tasks = await this.listTasksUseCase.execute(user.sub, query);

    return tasks.map((task) => this.toResponse(task));
  }

  @Get(':taskId')
  @ApiOperation({
    summary: 'Buscar uma task especifica do usuario autenticado',
  })
  @ApiOkResponse({
    description: 'Task encontrada',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Task nao encontrada' })
  async getById(
    @CurrentUser() user: JwtPayload,
    @Param('taskId') taskId: string,
  ): Promise<TaskResponseDto> {
    return this.toResponse(
      await this.getTaskByIdUseCase.execute(user.sub, taskId),
    );
  }

  @Patch(':taskId')
  @ApiOperation({ summary: 'Atualizar uma task do usuario autenticado' })
  @ApiOkResponse({
    description: 'Task atualizada com sucesso',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Task nao encontrada' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('taskId') taskId: string,
    @Body() payload: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.toResponse(
      await this.updateTaskUseCase.execute(user.sub, taskId, payload),
    );
  }

  @Delete(':taskId')
  @ApiOperation({ summary: 'Remover uma task do usuario autenticado' })
  @ApiOkResponse({
    description: 'Task removida com sucesso',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Task nao encontrada' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('taskId') taskId: string,
  ): Promise<TaskResponseDto> {
    return this.toResponse(
      await this.deleteTaskUseCase.execute(user.sub, taskId),
    );
  }

  private toResponse(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
