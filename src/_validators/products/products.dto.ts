import { createZodDto } from 'nestjs-zod';
import { createOrUpdateProductBodySchema } from './products.schema';

export class CreateOrUpdateProductBodyDto extends createZodDto(
  createOrUpdateProductBodySchema,
) {}
