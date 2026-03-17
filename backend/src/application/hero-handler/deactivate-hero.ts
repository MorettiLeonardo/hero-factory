import type { Hero } from "../../domain/entities/hero";
import { findHeroById, updateHeroById } from "../../infrastructure/repositories/hero.repository";
import type { Result } from "../../types/result";

export async function deactivateHeroAsync(id: string): Promise<Result<Hero, Error>> {
    if (!id) {
        return { success: false, error: new Error("ID is required") };
    }

    const hero = await findHeroById(id);

    if (!hero) {
        return { success: false, error: new Error("Hero not found") };
    }

    const updatedHero = await updateHeroById(id, {
        is_active: false
    });

    return { success: true, data: updatedHero };
}
