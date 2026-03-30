import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'secret123',
    minLength: 6,
    description: 'Senha atual do usuario autenticado',
  })
  @IsString()
  @MinLength(6)
  currentPassword!: string;

  @ApiProperty({
    example: 'secret456',
    minLength: 6,
    description: 'Nova senha que sera persistida apos validacao',
  })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
