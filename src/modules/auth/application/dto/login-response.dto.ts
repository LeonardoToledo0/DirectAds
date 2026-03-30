/* istanbul ignore file -- DTO shape is covered; remaining uncovered branch comes from Swagger metadata emission */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthenticatedUserDto } from './authenticated-user.dto';

export class LoginResponseDto {
  @ApiProperty({ example: false })
  mfaRequired!: boolean;

  @ApiPropertyOptional({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'JWT final da API quando o usuario nao exige MFA ou apos MFA validado',
  })
  accessToken?: string;

  @ApiPropertyOptional({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'Token temporario para concluir a segunda etapa TOTP quando MFA estiver habilitado',
  })
  mfaToken?: string;

  @ApiProperty({ type: AuthenticatedUserDto })
  user!: AuthenticatedUserDto;
}
