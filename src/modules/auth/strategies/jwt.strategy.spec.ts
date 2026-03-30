import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('returns the validated JWT payload', () => {
    const strategy = new JwtStrategy();

    const result = strategy.validate({
      sub: 'user-1',
      email: 'leona@example.com',
    });

    expect(result).toEqual({
      sub: 'user-1',
      email: 'leona@example.com',
    });
  });
});
