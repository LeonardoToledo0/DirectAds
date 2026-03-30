import { PasswordService } from './password.service';

describe('PasswordService', () => {
  it('hashes and validates passwords', async () => {
    const service = new PasswordService();

    const hash = await service.hashPassword('secret123');

    expect(hash).not.toBe('secret123');
    await expect(service.comparePassword('secret123', hash)).resolves.toBe(
      true,
    );
    await expect(service.comparePassword('wrong123', hash)).resolves.toBe(
      false,
    );
  });
});
