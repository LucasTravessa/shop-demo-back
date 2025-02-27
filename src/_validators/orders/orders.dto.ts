import { createZodDto } from 'nestjs-zod';
import { createOrUpdateOrderBodySchema } from './orders.schema';

export class CreateOrUpdateOrderBodyDto extends createZodDto(
  createOrUpdateOrderBodySchema,
) {}
