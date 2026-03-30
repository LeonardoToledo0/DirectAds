/* istanbul ignore file -- DTO metadata and validation decorators are exercised through consumer tests; remaining branches come from emitted metadata */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../../domain/entities/task-status.enum';

export class TaskQueryDto {
  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Filtro opcional por status',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
