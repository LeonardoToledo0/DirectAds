import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'leona@example.com',
    description: 'Email do usuário registrado',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'secret123',
    minLength: 6,
    description: 'Senha do usuário',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
