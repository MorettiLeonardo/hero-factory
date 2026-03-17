import type { Hero } from "../../domain/entities/hero";
import { findAllHeroes } from "../../infrastructure/repositories/hero.repository";
import type { Result } from "../../types/result";

export async function listHeroesAsync(page: number, search?: string): Promise<Result<Hero[], Error>> {
    const pageNumber = Number(page);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
        return { success: false, error: new Error("Page must be a positive integer") };
    }

    const heroes = await findAllHeroes(pageNumber, search);
    return { success: true, data: heroes };
}

