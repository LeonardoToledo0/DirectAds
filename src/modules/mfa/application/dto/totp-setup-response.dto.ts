/* istanbul ignore file -- DTO shape is covered; remaining uncovered branch comes from Swagger metadata emission */
import { ApiProperty } from '@nestjs/swagger';

export class TotpSetupResponseDto {
  @ApiProperty({ example: 'JBSWY3DPEHPK3PXP' })
  secret!: string;

  @ApiProperty({
    example:
      'otpauth://totp/DirectAds:leona@example.com?secret=JBSWY3DPEHPK3PXP&issuer=DirectAds',
  })
  otpauthUrl!: string;

  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' })
  qrCodeDataUrl!: string;
}
