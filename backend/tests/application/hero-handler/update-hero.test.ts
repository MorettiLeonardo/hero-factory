import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Hero } from "../../../src/domain/entities/hero";
import { updateHeroAsync } from "../../../src/application/hero-handler/update-hero";

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

describe("updateHeroAsync", () => {
    beforeEach(() => {
        mockFindHeroById.mockReset();
        mockUpdateHeroById.mockReset();
    });

    it("update hero when id and data are valid and hero is active", async () => {
        const hero = makeHero({ id: "abc", is_active: true });
        const updated = makeHero({ id: "abc", name: "Hulk Updated" });
        mockFindHeroById.mockResolvedValue(hero);
        mockUpdateHeroById.mockResolvedValue(updated);

        const result = await updateHeroAsync("abc", {
            name: "Hulk Updated",
            avatar_url: "https://example.com/hulk.jpg",
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.name).toBe("Hulk Updated");
        }
        expect(mockUpdateHeroById).toHaveBeenCalledWith(
            "abc",
            expect.objectContaining({ name: "Hulk Updated" })
        );
    });

    it("returns error when id is empty", async () => {
        const result = await updateHeroAsync("", { avatar_url: "https://x.com/a.jpg" });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.message).toBe("ID is required");
        }
        expect(mockFindHeroById).not.toHaveBeenCalled();
    });

    it("returns error when hero is not active", async () => {
        const hero = makeHero({ id: "abc", is_active: false });
        mockFindHeroById.mockResolvedValue(hero);

        const result = await updateHeroAsync("abc", { avatar_url: "https://example.com/hulk.jpg" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.message).toBe("Inactive hero cannot be edited");
        }
        expect(mockUpdateHeroById).not.toHaveBeenCalled();
    });

    it("returns validation error when avatar_url is missing", async () => {
        const hero = makeHero({ id: "abc" });
        mockFindHeroById.mockResolvedValue(hero);

        const result = await updateHeroAsync("abc", {});

        expect(result.success).toBe(false);
        expect(mockUpdateHeroById).not.toHaveBeenCalled();
    });

    it("returns error when hero is not found", async () => {
        mockFindHeroById.mockResolvedValue(null);

        await expect(
            updateHeroAsync("inexistente", { avatar_url: "https://example.com/x.jpg" })
        ).rejects.toThrow("Hero not found");
    });
});
