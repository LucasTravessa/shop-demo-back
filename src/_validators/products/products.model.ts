import { Product } from '@prisma/client';

export interface ICreateOrUpdateProductBody
  extends Pick<
    Product,
    'title' | 'description' | 'picture' | 'price' | 'quantity'
  > {}
