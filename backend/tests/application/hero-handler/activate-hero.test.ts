import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Hero } from "../../../src/domain/entities/hero";
import { activateHeroAsync } from "../../../src/application/hero-handler/activate-hero";

const mockFindHeroById = vi.fn();
const mockUpdateHeroById = vi.fn();
vi.mock("../../../src/infrastructure/repositories/hero.repository", () => ({
    findHeroById: (id: string) => mockFindHeroById(id),
    updateHeroById: (id: string, data: unknown) => mockUpdateHeroById(id, data),
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

describe("activateHeroAsync", () => {
    beforeEach(() => {
        mockFindHeroById.mockReset();
        mockUpdateHeroById.mockReset();
    });

    it("activate the hero and return updated data", async () => {
        const hero = makeHero({ id: "abc", is_active: false });
        const activated = makeHero({ id: "abc", is_active: true });
        mockFindHeroById.mockResolvedValue(hero);
        mockUpdateHeroById.mockResolvedValue(activated);

        const result = await activateHeroAsync("abc");

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.is_active).toBe(true);
        }
        expect(mockUpdateHeroById).toHaveBeenCalledWith("abc", { is_active: true });
    });

    it("returns an error when the id is empty", async () => {
        const result = await activateHeroAsync("");
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.message).toBe("ID is required");
        }
        expect(mockFindHeroById).not.toHaveBeenCalled();
    });

    it("returns an error when the hero is not found", async () => {
        mockFindHeroById.mockResolvedValue(null);
        await expect(activateHeroAsync("inexistente")).rejects.toThrow("Hero not found");
        expect(mockUpdateHeroById).not.toHaveBeenCalled();
    });
});
