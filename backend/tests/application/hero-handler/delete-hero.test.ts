import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Hero } from "../../../src/domain/entities/hero";
import { deleteHeroAsync } from "../../../src/application/hero-handler/delete-hero";

const mockFindHeroById = vi.fn();
const mockDeleteHeroById = vi.fn();
vi.mock("../../../src/infrastructure/repositories/hero.repository", () => ({
    findHeroById: (id: string) => mockFindHeroById(id),
    deleteHeroById: (id: string) => mockDeleteHeroById(id),
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

describe("deleteHeroAsync", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDeleteHeroById.mockResolvedValue(undefined);
    });

    it("deletes hero and returns success", async () => {
        const hero = makeHero({ id: "abc" });
        mockFindHeroById.mockResolvedValue(hero);

        const result = await deleteHeroAsync("abc");

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBeNull();
        }
        expect(mockDeleteHeroById).toHaveBeenCalledWith("abc");
    });

    it("returns an error when id is empty", async () => {
        const result = await deleteHeroAsync("");
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.message).toBe("ID is required");
        }
        expect(mockDeleteHeroById).toHaveBeenCalledTimes(0);
    });

    it("returns an error when hero is not found", async () => {
        mockFindHeroById.mockResolvedValue(null);

        await expect(deleteHeroAsync("inexistente")).rejects.toThrow("Hero not found");
        expect(mockDeleteHeroById).toHaveBeenCalledTimes(0);
    });
});
