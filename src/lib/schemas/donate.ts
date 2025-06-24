import { z } from "zod";

export const donateSchema = z.object({
    amount: z.coerce.number().min(1, {message: 'minimum deposit amount is 1'})
});