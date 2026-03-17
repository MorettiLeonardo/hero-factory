import type { Hero } from "../../domain/entities/hero";
import { findHeroById } from "../../infrastructure/repositories/hero.repository";
import type { Result } from "../../types/result";

export async function getHeroByIdAsync(id: string): Promise<Result<Hero, Error>> {
    if (!id) {
        return { success: false, error: new Error("ID is required") };
    }

    const hero = await findHeroById(id);

    if (!hero) {
        return { success: false, error: new Error("Hero not found") };
    }

    return { success: true, data: hero };
}
