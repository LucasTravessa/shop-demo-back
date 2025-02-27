import { z } from 'zod';
import { ICreateOrUpdateOrderBody } from './orders.model';

export const createOrUpdateOrderBodySchema: z.ZodSchema<ICreateOrUpdateOrderBody> =
  z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive(),
  });
