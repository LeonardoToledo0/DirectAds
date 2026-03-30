import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/controllers/auth.controller';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { GetAuthenticatedUserUseCase } from './application/use-cases/get-authenticated-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { PasswordService } from './application/services/password.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { getJwtModuleOptions } from '../../config/auth/jwt.config';

@Module({
  imports: [PassportModule, JwtModule.register(getJwtModuleOptions())],
  controllers: [AuthController],
  providers: [
    PasswordService,
    RegisterUserUseCase,
    LoginUserUseCase,
    ChangePasswordUseCase,
    GetAuthenticatedUserUseCase,
    JwtStrategy,
  ],
})
export class AuthModule {}
