import { z } from "zod";

export const updateHeroSchema = z.object({
    name: z.string().min(3).max(50).optional(),
    nickname: z.string().min(2).max(30).optional(),
    date_of_birth: z.coerce.date()
        .max(new Date(), "Date of birth cannot be in the future")
        .optional(),
    universe: z.string().optional(),
    main_power: z.string().min(2).max(50).optional(),
    avatar_url: z.string(),
}).strict();
