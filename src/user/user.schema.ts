import { z, ZodType } from 'zod';
type ZodSchema<T> = ZodType<T, any>;

export const IdParamSchema = z.object({
    params: z.object({ id: z.string().min(1), })
});