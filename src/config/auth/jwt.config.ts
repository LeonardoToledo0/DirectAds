import { JwtModuleOptions } from '@nestjs/jwt';

export const DEFAULT_JWT_SECRET = 'directads-dev-secret';
export const DEFAULT_JWT_EXPIRES_IN = '1h';

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
}

export function getJwtModuleOptions(): JwtModuleOptions {
  return {
    secret: getJwtSecret(),
    signOptions: { expiresIn: DEFAULT_JWT_EXPIRES_IN },
  };
}
