/* istanbul ignore file -- DTO metadata and validation decorators are exercised through consumer tests; remaining branches come from emitted metadata */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../../domain/entities/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Preparar demonstracao tecnica',
    minLength: 3,
    maxLength: 120,
    description: 'Titulo principal da task',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({
    example: 'Organizar roteiro, dados de teste e pontos de arquitetura',
    maxLength: 500,
    description: 'Descricao opcional com contexto adicional da task',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    default: TaskStatus.TODO,
    description: 'Status inicial da task',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
