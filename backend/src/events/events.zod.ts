import { z } from 'zod';

export const createEventSchema = z.object({
  clientId: z.number().int().positive(),
  type: z.enum(['deposit', 'withdraw', 'insurance', 'other']),
  value: z.number(), 
  frequency: z.enum(['once', 'monthly', 'yearly']),
});

export const updateEventSchema = createEventSchema
  .partial()
  .extend({
    clientId: z.undefined(),
  });

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
