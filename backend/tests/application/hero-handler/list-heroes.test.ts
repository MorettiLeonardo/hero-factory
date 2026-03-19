import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Hero } from "../../../src/domain/entities/hero";
import { listHeroesAsync } from "../../../src/application/hero-handler/list-heroes";

const mockFindAllHeroes = vi.fn();
vi.mock("../../../src/infrastructure/repositories/hero.repository", () => ({
    findAllHeroes: (page: number, search?: string) => mockFindAllHeroes(page, search),
}));

function makeHero(overrides: Partial<Hero> = {}): Hero {
    return {
        id: "id-1",
        name: "Robert Bruce Banner",
        nickname: "Hulk",
        date_of_birth: new Date("1962-04-10"),
        universe: "Marvel",
        main_power: "Force",
        avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
        is_active: false,
        created_at: new Date(),
        updated_at: new Date(),
        ...overrides,
    };
}

describe("listHeroesAsync", () => {
    beforeEach(() => {
        mockFindAllHeroes.mockReset();
    });

    it("returns list of heroes for valid page", async () => {
        const heroes = [makeHero({ id: "1" }), makeHero({ id: "2" })];
        mockFindAllHeroes.mockResolvedValue(heroes);

        const result = await listHeroesAsync(1);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(heroes);
        }
        expect(mockFindAllHeroes).toHaveBeenCalledWith(1, undefined);
    });

    it("passes search to the repository when provided", async () => {
        mockFindAllHeroes.mockResolvedValue([]);

        await listHeroesAsync(2, "Hulk");

        expect(mockFindAllHeroes).toHaveBeenCalledWith(2, "Hulk");
    });

    it("returns error when page is not an integer", async () => {
        const result = await listHeroesAsync(0);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.message).toBe("Page must be an integer");
        }
        expect(mockFindAllHeroes).not.toHaveBeenCalled();

        const result2 = await listHeroesAsync(1.5);
        expect(result2.success).toBe(false);
        expect(mockFindAllHeroes).not.toHaveBeenCalled();
    });

    it("returns error when page is less than 1", async () => {
        const result = await listHeroesAsync(-1);
        expect(result.success).toBe(false);
        expect(mockFindAllHeroes).not.toHaveBeenCalled();
    });
});
