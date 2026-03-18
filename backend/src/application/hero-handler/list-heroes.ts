import type { Hero } from "../../domain/entities/hero";
import { findAllHeroes } from "../../infrastructure/repositories/hero.repository";
import type { Result } from "../../types/result";
import { PageMustBeInteger } from "../../utils/error";

export async function listHeroesAsync(page: number, search?: string): Promise<Result<Hero[], Error>> {
    const pageNumber = Number(page);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
        return { success: false, error: new PageMustBeInteger() };
    }

    const heroes = await findAllHeroes(pageNumber, search);
    return { success: true, data: heroes };
}

