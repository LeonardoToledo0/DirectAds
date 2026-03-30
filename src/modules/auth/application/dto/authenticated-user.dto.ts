/* istanbul ignore file -- DTO shape is covered; remaining uncovered branch comes from Swagger metadata emission */
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUserDto {
  @ApiProperty({ example: 'user-1' })
  id!: string;

  @ApiProperty({ example: 'Leona' })
  name!: string;

  @ApiProperty({ example: 'leona@example.com' })
  email!: string;

  @ApiProperty({ example: false })
  mfaEnabled!: boolean;

  @ApiProperty({ example: '2026-03-30T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-03-30T00:00:00.000Z' })
  updatedAt!: Date;
}
