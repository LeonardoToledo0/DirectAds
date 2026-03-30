import {
  DEFAULT_JWT_EXPIRES_IN,
  DEFAULT_JWT_SECRET,
  getJwtModuleOptions,
  getJwtSecret,
} from './jwt.config';

describe('jwt.config', () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  afterEach(() => {
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
      return;
    }

    process.env.JWT_SECRET = originalJwtSecret;
  });

  it('returns the default secret when JWT_SECRET is not defined', () => {
    delete process.env.JWT_SECRET;

    expect(getJwtSecret()).toBe(DEFAULT_JWT_SECRET);
  });

  it('returns the configured secret when JWT_SECRET is defined', () => {
    process.env.JWT_SECRET = 'custom-secret';

    expect(getJwtSecret()).toBe('custom-secret');
  });

  it('builds the JWT module options with the resolved secret', () => {
    process.env.JWT_SECRET = 'custom-secret';

    expect(getJwtModuleOptions()).toEqual({
      secret: 'custom-secret',
      signOptions: { expiresIn: DEFAULT_JWT_EXPIRES_IN },
    });
  });
});
