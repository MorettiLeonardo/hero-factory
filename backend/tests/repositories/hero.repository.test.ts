import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Hero } from "../../../src/domain/entities/hero";

const mocks = vi.hoisted(() => ({
    mockCreateHero: vi.fn(),
    mockFindAllHeroes: vi.fn(),
    mockFindHeroById: vi.fn(),
    mockUpdateHeroById: vi.fn(),
    mockDeleteHeroById: vi.fn(),
}));

vi.mock("../../../src/infrastructure/database/prisma", () => ({
    prisma: {
        hero: {
            create: mocks.mockCreateHero,
            findMany: mocks.mockFindAllHeroes,
            findUnique: mocks.mockFindHeroById,
            update: mocks.mockUpdateHeroById,
            delete: mocks.mockDeleteHeroById,
        },
    },
}));

import {
    createHero,
    deleteHeroById,
    findAllHeroes,
    findHeroById,
    updateHeroById,
} from "../../../src/infrastructure/repositories/hero.repository";

function makeHero(overrides: Partial<Hero> = {}): Hero {
    const base: Hero = {
        id: "id-1",
        name: "Robert Bruce Banner",
        nickname: "Hulk",
        date_of_birth: new Date("1962-04-10T00:00:00.000Z"),
        universe: "Marvel",
        main_power: "Force",
        avatar_url: "https://cdn.example.com/avatar.png",
        is_active: true,
        created_at: new Date("2024-01-01T10:30:00.000Z"),
        updated_at: new Date("2024-01-02T14:00:00.000Z"),
    };

    return { ...base, ...overrides };
}

describe("hero.repository (unit)", () => {
    beforeEach(() => {
        mocks.mockCreateHero.mockReset();
        mocks.mockFindAllHeroes.mockReset();
        mocks.mockFindHeroById.mockReset();
        mocks.mockUpdateHeroById.mockReset();
        mocks.mockDeleteHeroById.mockReset();
    });

    describe("createHero", () => {
        it("creates a hero and forces is_active=true + normalizes date_of_birth", async () => {
            const payload = {
                name: "Robert Bruce Banner",
                nickname: "Hulk",
                date_of_birth: new Date("1962-04-10T00:00:00.000Z"),
                universe: "Marvel",
                main_power: "Force",
                avatar_url: "https://cdn.example.com/avatar.png",
            } as Parameters<typeof createHero>[0];

            const created = makeHero({ id: "abc", is_active: true });
            mocks.mockCreateHero.mockResolvedValue(created);

            const result = await createHero(payload);

            expect(result).toEqual(created);
            expect(mocks.mockCreateHero).toHaveBeenCalledTimes(1);

            const arg = mocks.mockCreateHero.mock.calls[0][0];
            expect(arg).toEqual({
                data: {
                    ...payload,
                    is_active: true,
                    date_of_birth: new Date(payload.date_of_birth),
                },
            });
        });
    });

    describe("findAllHeroes", () => {
        it("finds heroes without search (where = {})", async () => {
            const page = 2;
            const expected = [makeHero({ id: "h-1" })];
            mocks.mockFindAllHeroes.mockResolvedValue(expected);

            const result = await findAllHeroes(page);

            expect(result).toEqual(expected);
            expect(mocks.mockFindAllHeroes).toHaveBeenCalledTimes(1);
            expect(mocks.mockFindAllHeroes).toHaveBeenCalledWith({
                where: {},
                orderBy: { created_at: "desc" },
                skip: (page - 1) * 10,
                take: 10,
            });
        });

        it("finds heroes by search using OR contains on name and nickname", async () => {
            const page = 1;
            const search = "Hulk";
            const expected = [makeHero({ id: "h-1" })];
            mocks.mockFindAllHeroes.mockResolvedValue(expected);

            const result = await findAllHeroes(page, search);

            expect(result).toEqual(expected);
            expect(mocks.mockFindAllHeroes).toHaveBeenCalledTimes(1);
            expect(mocks.mockFindAllHeroes).toHaveBeenCalledWith({
                where: {
                    OR: [{ name: { contains: search } }, { nickname: { contains: search } }],
                },
                orderBy: { created_at: "desc" },
                skip: 0,
                take: 10,
            });
        });
    });

    describe("findHeroById", () => {
        it("calls prisma.hero.findUnique with where.id", async () => {
            const hero = makeHero({ id: "abc" });
            mocks.mockFindHeroById.mockResolvedValue(hero);

            const result = await findHeroById("abc");

            expect(result).toEqual(hero);
            expect(mocks.mockFindHeroById).toHaveBeenCalledTimes(1);
            expect(mocks.mockFindHeroById).toHaveBeenCalledWith({ where: { id: "abc" } });
        });
    });

    describe("updateHeroById", () => {
        it("updates hero by id and forwards provided partial data", async () => {
            const id = "abc";
            const data: Partial<Hero> = { is_active: true };
            const updated = makeHero({ id, is_active: true });
            mocks.mockUpdateHeroById.mockResolvedValue(updated);

            const result = await updateHeroById(id, data);

            expect(result).toEqual(updated);
            expect(mocks.mockUpdateHeroById).toHaveBeenCalledTimes(1);
            expect(mocks.mockUpdateHeroById).toHaveBeenCalledWith({
                where: { id },
                data,
            });
        });
    });

    describe("deleteHeroById", () => {
        it("deletes hero by id", async () => {
            mocks.mockDeleteHeroById.mockResolvedValue(undefined);

            await expect(deleteHeroById("abc")).resolves.toBeUndefined();
            expect(mocks.mockDeleteHeroById).toHaveBeenCalledTimes(1);
            expect(mocks.mockDeleteHeroById).toHaveBeenCalledWith({ where: { id: "abc" } });
        });
    });
});

