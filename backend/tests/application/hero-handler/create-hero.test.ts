import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Hero } from "../../../src/domain/entities/hero";
import { createHeroAsync } from "../../../src/application/hero-handler/create-hero";

const mockCreateHero = vi.fn();
vi.mock("../../../src/infrastructure/repositories/hero.repository", () => ({
    createHero: (data: unknown) => mockCreateHero(data),
}));

function makeHero(overrides: Partial<Hero> = {}): Hero {
    const base: Hero = {
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
    };
    return { ...base, ...overrides };
}

describe("createHeroAsync", () => {
    beforeEach(() => {
        mockCreateHero.mockReset();
    });

    it("returns success with created hero when data is valid", async () => {
        const hero = makeHero();
        mockCreateHero.mockResolvedValue(hero);

        const payload = {
            name: "Robert Bruce Banner",
            nickname: "Hulk",
            date_of_birth: "1962-04-10",
            universe: "Marvel",
            main_power: "Force",
            avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
        };

        const result = await createHeroAsync(payload);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(hero);
        }
        expect(mockCreateHero).toHaveBeenCalledWith(
            expect.objectContaining({
                name: payload.name,
                nickname: payload.nickname,
                universe: payload.universe,
                main_power: payload.main_power,
                avatar_url: payload.avatar_url,
            })
        );
    });

    it("returns validation error when name is too short", async () => {
        const payload = {
            name: "AB",
            nickname: "Hulk",
            date_of_birth: "1962-04-10",
            universe: "Marvel",
            main_power: "Intelligence",
            avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
        };

        const result = await createHeroAsync(payload);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBeDefined();
        }
        expect(mockCreateHero).not.toHaveBeenCalled();
    });

    it("returns an error when date_of_birth is in the future", async () => {
        const future = new Date();
        future.setFullYear(future.getFullYear() + 1);
        const payload = {
            name: "Robert Bruce Banner",
            nickname: "Hulk",
            date_of_birth: future.toISOString(),
            universe: "Marvel",
            main_power: "Force",
            avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
        };

        const result = await createHeroAsync(payload);

        expect(result.success).toBe(false);
        expect(mockCreateHero).not.toHaveBeenCalled();
    });
});
