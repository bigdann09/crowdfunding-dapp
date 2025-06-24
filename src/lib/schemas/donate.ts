import { z } from "zod";

export const donateSchema = z.object({
    amount: z.coerce.number().min(0.5, {message: 'minimum deposit amount is 1'})
});