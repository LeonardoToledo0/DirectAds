/* istanbul ignore file -- DTO shape is covered; remaining uncovered branch comes from Swagger metadata emission */
import { ApiProperty } from '@nestjs/swagger';

export class TotpMfaStatusDto {
  @ApiProperty({ example: true })
  mfaEnabled!: boolean;

  @ApiProperty({ example: '2026-03-30T00:00:00.000Z', nullable: true })
  mfaConfirmedAt!: Date | null;
}
