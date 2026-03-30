import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const usersCount = await prisma.user.count();

  if (usersCount > 0) {
    return;
  }
}

main()
  .catch((error: unknown) => {
    console.error('Prisma seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
