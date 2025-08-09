import { z } from 'zod';

export const createWalletSchema = z.object({
  clientId: z.number().int().positive(),
  totalValue: z.number().nonnegative(),
  allocation: z
    .record(z.string(), z.number().min(0).max(100))
    .default({}),
});

export const updateWalletSchema = createWalletSchema
  .partial()
  .extend({

    clientId: z.undefined(),
  });

export type CreateWalletDto = z.infer<typeof createWalletSchema>;
export type UpdateWalletDto = z.infer<typeof updateWalletSchema>;
