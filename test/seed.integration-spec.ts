import bcrypt from 'bcryptjs';
import { TaskStatus } from '@prisma/client';
import { runSeed } from '../prisma/seed';

describe('Seed integration', () => {
  it('upserts evaluation users and their tasks', async () => {
    const userUpsert = jest.fn<Promise<void>, [unknown]>().mockResolvedValue();
    const taskUpsert = jest.fn<Promise<void>, [unknown]>().mockResolvedValue();
    const hashSpy = jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValue(Promise.resolve('hashed-password') as never);
    const prismaClient = {
      user: {
        upsert: userUpsert,
      },
      task: {
        upsert: taskUpsert,
      },
    } as never;

    await runSeed(prismaClient);

    expect(userUpsert).toHaveBeenCalledTimes(3);
    expect(taskUpsert).toHaveBeenCalledTimes(6);

    const firstUserCall = userUpsert.mock.calls[0][0] as {
      where: { email: string };
      update: { name: string; passwordHash: string };
    };
    const thirdUserCall = userUpsert.mock.calls[2][0] as {
      where: { email: string };
      create: { mfaEnabled: boolean; mfaSecret: null; mfaConfirmedAt: null };
    };
    const thirdTaskCall = taskUpsert.mock.calls[5][0] as {
      where: { id: string };
      create: { status: TaskStatus; userId: string };
    };

    expect(firstUserCall.where.email).toBe('leona@example.com');
    expect(firstUserCall.update.name).toBe('Leona Silva');
    expect(firstUserCall.update.passwordHash).toBe('hashed-password');
    expect(thirdUserCall.where.email).toBe('carla@example.com');
    expect(thirdUserCall.create.mfaEnabled).toBe(false);
    expect(thirdUserCall.create.mfaSecret).toBeNull();
    expect(thirdUserCall.create.mfaConfirmedAt).toBeNull();
    expect(thirdTaskCall.where.id).toBe('seed-task-carla-2');
    expect(thirdTaskCall.create.status).toBe(TaskStatus.IN_PROGRESS);
    expect(thirdTaskCall.create.userId).toBe('seed-user-carla');

    hashSpy.mockRestore();
  });
});
