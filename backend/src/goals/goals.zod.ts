import { z } from 'zod';

export const createGoalSchema = z.object({
  type: z.string().min(1),
  targetValue: z.number().positive(),
  targetDate: z.coerce.date(),  
  clientId: z.number().int().positive(),
});

export const updateGoalSchema = createGoalSchema.partial();

export type CreateGoalDto = z.infer<typeof createGoalSchema>;
export type UpdateGoalDto = z.infer<typeof updateGoalSchema>;
