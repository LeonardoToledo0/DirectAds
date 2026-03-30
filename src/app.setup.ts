import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

export function configureApp(app: INestApplication): void {
  const prismaService = app.get(PrismaService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  prismaService.enableShutdownHooks(app);
}
