import { z } from "zod";

export const createHeroSchema = z.object({
    name: z.string().min(3).max(50),
    nickname: z.string().min(2).max(30),
    date_of_birth: z.coerce.date().max(new Date(), "Date of birth cannot be in the future"),
    universe: z.string(),
    main_power: z.string().min(2).max(50),
    avatar_url: z.string(),
}).strict();