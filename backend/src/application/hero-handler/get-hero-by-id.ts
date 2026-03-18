import type { Hero } from "../../domain/entities/hero";
import { HeroNotFoundError } from "../../domain/errors/hero-not-found.error";
import { findHeroById } from "../../infrastructure/repositories/hero.repository";
import type { Result } from "../../types/result";
import { findOrFail } from "../../utils/find-or-fail";

export async function getHeroByIdAsync(id: string): Promise<Result<Hero, Error>> {
    if (!id) {
        return { success: false, error: new Error("ID is required") };
    }

    const hero = await findOrFail(
        () => findHeroById(id),
        new HeroNotFoundError()
    );

    return { success: true, data: hero };
}
