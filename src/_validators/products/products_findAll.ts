import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const findAllProductsSchema = z.object({
  searchBy: z
    .string()
    .optional()
    .refine((val) => val && ['title', 'description'].includes(val), {
      message: 'searchBy must be one of [title, description]',
    }),
  search: z.string().max(255).optional(),
  sortBy: z
    .string()
    .optional()
    .refine((val) => val && ['price'].includes(val), {
      message: 'sortBy must be one of [price]',
    }),
  order: z
    .string()
    .optional()
    .refine((val) => val && ['asc', 'desc'].includes(val), {
      message: 'order must be one of [asc, desc]',
    }),
});

export type IFindAllProductsQuery = z.infer<typeof findAllProductsSchema>;

export class FindAllProductsDto extends createZodDto(findAllProductsSchema) {}
