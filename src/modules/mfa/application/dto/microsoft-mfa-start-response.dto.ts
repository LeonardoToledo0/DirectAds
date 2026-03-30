/* istanbul ignore file -- DTO shape is covered; remaining uncovered branch comes from Swagger metadata emission */
import { ApiProperty } from '@nestjs/swagger';

export class MicrosoftMfaStartResponseDto {
  @ApiProperty({ example: 'microsoft' })
  provider!: 'microsoft';

  @ApiProperty({
    example:
      'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?...',
  })
  authorizationUrl!: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'State assinado que deve ser reenviado na etapa de verificacao',
  })
  state!: string;

  @ApiProperty({ example: '2026-03-30T00:10:00.000Z' })
  expiresAt!: Date;
}
