import type { Hero } from "../../domain/entities/hero";
import { createHero } from "../../infrastructure/repositories/hero.repository";
import type { Result } from "../../types/result";
import { createHeroSchema } from "./schemas/create-hero-schema";
import type { ZodError } from "zod";

export async function createHeroAsync(data: unknown): Promise<Result<Hero, ZodError>> {
    const parsed = createHeroSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, error: parsed.error };
    }

    const hero = await createHero(parsed.data);

    return { success: true, data: hero };
}