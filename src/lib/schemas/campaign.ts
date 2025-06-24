import { z } from "zod";

export const createCampaignSchema = z.object({
    title: z.string()
        .min(10, { message: "Title must be at least 10 characters long" }),
    goal: z.coerce.number()
        .min(5, { message: "Goal must be at least 5" }),
    startDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: "Invalid start datetime",
        }),
    endDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: "Invalid end datetime",
    }),
    description: z.string()
        .min(5, { message: "Description must be at least 5 characters long" })
}).refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
});