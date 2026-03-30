import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Leona',
    minLength: 2,
    description: 'Nome do usuário a ser registrado',
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    example: 'leona@example.com',
    description: 'Email único do usuário',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'secret123',
    minLength: 6,
    description: 'Senha em texto puro enviada apenas no registro',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
