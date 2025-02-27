import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seedUsers';
import seedPasswords from './seedPasswords';
import { seedRoles } from './seedRoles';
import { seedAdmins } from './seedAdmins';
import { seedProducts } from './seedProducts';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
  await seedUsers(prisma);
  await seedPasswords(prisma);
  await seedRoles(prisma);
  await seedAdmins(prisma);
  await seedProducts(prisma);
}

seed()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
