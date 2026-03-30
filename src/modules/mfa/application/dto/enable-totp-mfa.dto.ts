/* istanbul ignore file -- DTO metadata and validation decorators are exercised through consumer tests; remaining branches come from emitted metadata */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class EnableTotpMfaDto {
  @ApiProperty({ example: '123456', minLength: 6, maxLength: 6 })
  @IsString()
  @Length(6, 6)
  code!: string;
}
