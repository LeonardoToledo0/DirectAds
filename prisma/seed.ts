import { TaskStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedUserInput {
  id: string;
  name: string;
  email: string;
  password: string;
  microsoftAccountId?: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
  }>;
}

const seedUsers: SeedUserInput[] = [
  {
    id: 'seed-user-leona',
    name: 'Leona Silva',
    email: 'leona@example.com',
    password: 'secret123',
    tasks: [
      {
        id: 'seed-task-leona-1',
        title: 'Revisar arquitetura do backend',
        description: 'Conferir modulos, fluxos de autenticacao e quality gates.',
        status: TaskStatus.IN_PROGRESS,
      },
      {
        id: 'seed-task-leona-2',
        title: 'Validar Swagger para a entrevista',
        description: 'Garantir que health, auth, tasks e MFA estejam documentados.',
        status: TaskStatus.TODO,
      },
    ],
  },
  {
    id: 'seed-user-mario',
    name: 'Mario Souza',
    email: 'mario@example.com',
    password: 'secret123',
    tasks: [
      {
        id: 'seed-task-mario-1',
        title: 'Executar smoke tests da avaliacao',
        description: 'Subir o projeto e validar endpoints principais localmente.',
        status: TaskStatus.DONE,
      },
      {
        id: 'seed-task-mario-2',
        title: 'Preparar feedback da entrega',
        description: 'Organizar observacoes sobre arquitetura, testes e DX.',
        status: TaskStatus.TODO,
      },
    ],
  },
  {
    id: 'seed-user-microsoft',
    name: 'Microsoft User',
    email: 'microsoft.user@example.com',
    password: 'secret123',
    microsoftAccountId: 'microsoft-user-1',
    tasks: [
      {
        id: 'seed-task-microsoft-1',
        title: 'Validar fluxo Microsoft MFA',
        description: 'Confirmar state, code mockado e segunda etapa MFA.',
        status: TaskStatus.DONE,
      },
      {
        id: 'seed-task-microsoft-2',
        title: 'Conferir vinculacao da conta Microsoft',
        description: 'Garantir que microsoftAccountId esteja persistido no usuario.',
        status: TaskStatus.IN_PROGRESS,
      },
    ],
  },
];

export async function runSeed(client: PrismaClient): Promise<void> {
  for (const userInput of seedUsers) {
    const passwordHash = await bcrypt.hash(userInput.password, 10);

    await client.user.upsert({
      where: { email: userInput.email },
      update: {
        name: userInput.name,
        passwordHash,
        microsoftAccountId: userInput.microsoftAccountId,
      },
      create: {
        id: userInput.id,
        name: userInput.name,
        email: userInput.email,
        passwordHash,
        microsoftAccountId: userInput.microsoftAccountId,
      },
    });

    for (const taskInput of userInput.tasks) {
      await client.task.upsert({
        where: { id: taskInput.id },
        update: {
          title: taskInput.title,
          description: taskInput.description,
          status: taskInput.status,
          userId: userInput.id,
        },
        create: {
          id: taskInput.id,
          title: taskInput.title,
          description: taskInput.description,
          status: taskInput.status,
          userId: userInput.id,
        },
      });
    }
  }
}

async function main() {
  await runSeed(prisma);
}

main()
  .catch((error: unknown) => {
    console.error('Prisma seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
