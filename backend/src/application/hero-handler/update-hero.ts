import type { Hero } from "../../domain/entities/hero";
import { findHeroById, updateHeroById, } from "../../infrastructure/repositories/hero.repository";
import type { Result } from "../../types/result";
import { updateHeroSchema } from "./schemas/update-hero-schema";
import type { ZodError } from "zod";

export async function updateHeroAsync(id: string, data: unknown): Promise<Result<Hero, Error | ZodError>> {
    if (!id) {
        return { success: false, error: new Error("ID is required") };
    }

    const hero = await findHeroById(id);

    if (!hero) {
        return { success: false, error: new Error("Hero not found") };
    }

    if (!hero.is_active) {
        return { success: false, error: new Error("Inactive hero cannot be edited") };
    }

    const parsed = updateHeroSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, error: parsed.error };
    }

    const updated = await updateHeroById(id, parsed.data);
    return { success: true, data: updated };
}
