import { PrismaClient } from '@prisma/client';
import { productsData } from './data/products';

export async function seedProducts(prisma: PrismaClient): Promise<void> {
  if ((await prisma.product.count()) < 1) {
    await prisma.product.createMany({
      data: productsData,
    });
  }
}
