/* istanbul ignore file -- DTO metadata and validation decorators are exercised through consumer tests; remaining branches come from emitted metadata */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyMicrosoftMfaDto {
  @ApiProperty({
    example: 'mock-microsoft-auth-code',
    description:
      'Codigo devolvido pelo provider Microsoft ao fim da autenticacao federada',
  })
  @IsString()
  code!: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'State assinado emitido na etapa de inicio do fluxo Microsoft MFA',
  })
  @IsString()
  state!: string;

  @ApiProperty({
    example: '123456',
    description: 'Codigo da segunda etapa de verificacao MFA',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6)
  verificationCode!: string;
}
