/* istanbul ignore file -- DTO metadata and validation decorators are exercised through consumer tests; remaining branches come from emitted metadata */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class StartMicrosoftMfaDto {
  @ApiPropertyOptional({
    example: 'http://localhost:3000/auth/microsoft/callback',
    description:
      'Callback opcional para sobrescrever o redirect URI padrao do provider',
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  redirectUri?: string;
}
