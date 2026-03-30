/* istanbul ignore file -- DTO shape is covered; remaining uncovered branch comes from Swagger metadata emission */
import { ApiProperty } from '@nestjs/swagger';
import { AuthenticatedUserDto } from '../../../auth/application/dto/authenticated-user.dto';

class MicrosoftMfaMetadataDto {
  @ApiProperty({ example: 'microsoft' })
  provider!: 'microsoft';

  @ApiProperty({ example: true })
  secondFactorVerified!: boolean;
}

export class MicrosoftMfaAuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT de acesso emitido apos o fluxo Microsoft MFA',
  })
  accessToken!: string;

  @ApiProperty({ type: AuthenticatedUserDto })
  user!: AuthenticatedUserDto;

  @ApiProperty({ type: MicrosoftMfaMetadataDto })
  mfa!: MicrosoftMfaMetadataDto;
}
