/* istanbul ignore file -- DTO metadata and validation decorators are exercised through consumer tests; remaining branches come from emitted metadata */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../../domain/entities/task-status.enum';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    example: 'Refinar demonstracao tecnica',
    minLength: 3,
    maxLength: 120,
    description: 'Novo titulo da task',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({
    example: 'Atualizar roteiro com validacoes finais',
    maxLength: 500,
    nullable: true,
    description: 'Nova descricao da task; pode ser limpa explicitamente',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Novo status da task',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
