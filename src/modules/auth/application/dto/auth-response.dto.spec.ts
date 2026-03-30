import { AuthResponseDto } from './auth-response.dto';

describe('AuthResponseDto', () => {
  it('holds the expected auth response shape', () => {
    const dto = new AuthResponseDto();

    dto.accessToken = 'token';
    dto.user = {
      id: 'user-1',
      name: 'Leona',
      email: 'leona@example.com',
      mfaEnabled: true,
      createdAt: new Date('2026-03-30T00:00:00.000Z'),
      updatedAt: new Date('2026-03-30T00:00:00.000Z'),
    };

    expect(dto.accessToken).toBe('token');
    expect(dto.user.email).toBe('leona@example.com');
    expect(dto.user.mfaEnabled).toBe(true);
  });
});
