/* istanbul ignore file -- DTO shape is covered; remaining uncovered branch comes from Swagger metadata emission */
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../domain/entities/task-status.enum';

export class TaskResponseDto {
  @ApiProperty({ example: 'task-1' })
  id!: string;

  @ApiProperty({ example: 'Preparar demonstracao tecnica' })
  title!: string;

  @ApiProperty({
    example: 'Organizar roteiro, testes e pontos de arquitetura',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
  status!: TaskStatus;

  @ApiProperty({ example: '2026-03-30T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-03-30T00:00:00.000Z' })
  updatedAt!: Date;
}
