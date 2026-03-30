import { AuthenticatedUserDto } from './authenticated-user.dto';

describe('AuthenticatedUserDto', () => {
  it('holds the expected authenticated user shape', () => {
    const dto = new AuthenticatedUserDto();

    dto.id = 'user-1';
    dto.name = 'Leona';
    dto.email = 'leona@example.com';
    dto.createdAt = new Date('2026-03-30T00:00:00.000Z');
    dto.updatedAt = new Date('2026-03-30T00:00:00.000Z');

    expect(dto.id).toBe('user-1');
    expect(dto.email).toBe('leona@example.com');
  });
});
