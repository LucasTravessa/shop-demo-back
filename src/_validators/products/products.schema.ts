import { z } from 'zod';
import { ICreateOrUpdateProductBody } from './products.model';

export const createOrUpdateProductBodySchema: z.ZodSchema<ICreateOrUpdateProductBody> =
  z.object({
    title: z.string().max(255),
    description: z.string().nullable(),
    picture: z
      .string()
      .url({ message: 'Picture URL is not valid.' })
      .nullable(),
    price: z
      .number()
      .positive()
      .max(999999.99, { message: 'Price may be max 2 decimal long' }),
    quantity: z.number().int().positive(),
  });
