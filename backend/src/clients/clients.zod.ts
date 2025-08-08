import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().min(0),
  isActive: z.boolean().optional().default(true),
  familyProfile: z.string().min(1),
});

export const updateClientSchema = createClientSchema.partial();
export type CreateClientDto = z.infer<typeof createClientSchema>;
export type UpdateClientDto = z.infer<typeof updateClientSchema>;
