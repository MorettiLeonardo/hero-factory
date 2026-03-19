import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import Fastify from "fastify";
import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { heroRoutes } from "../../src/interfaces/http/routes/hero.routes";
import type { Hero } from "../../src/domain/entities/hero";

const mockCreateHero = vi.fn();
const mockFindAllHeroes = vi.fn();
const mockFindHeroById = vi.fn();
const mockUpdateHeroById = vi.fn();
const mockDeleteHeroById = vi.fn();

vi.mock("../../src/infrastructure/repositories/hero.repository", () => ({
    createHero: (data: unknown) => mockCreateHero(data),
    findAllHeroes: (page: number, search?: string) => mockFindAllHeroes(page, search),
    findHeroById: (id: string) => mockFindHeroById(id),
    updateHeroById: (id: string, data: unknown) => mockUpdateHeroById(id, data),
    deleteHeroById: (id: string) => mockDeleteHeroById(id),
}));

function makeTestApp(): FastifyInstance {
    const app = Fastify();

    app.register(cors, {
        origin: true,
        methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    });

    app.register(heroRoutes);

    app.setErrorHandler((error: Error, _, reply) => {
        const status = error.message === "Hero not found" ? 404 : 400;
        return reply.status(status).send({ message: error.message });
    });

    return app;
}

describe("integration: hero routes -> handlers -> zod", () => {
    let app: FastifyInstance;

    beforeEach(async () => {
        mockCreateHero.mockReset();
        mockFindAllHeroes.mockReset();
        mockFindHeroById.mockReset();
        mockUpdateHeroById.mockReset();
        mockDeleteHeroById.mockReset();

        app?.close?.();
        app = makeTestApp();
        await app.ready();
    });

    afterAll(async () => {
        await app?.close?.();
    });

    it("POST /heroes: rejeita payload inválido (Zod) com 400", async () => {
        const res = await app.inject({
            method: "POST",
            url: "/heroes",
            payload: {
                name: "AB",
                nickname: "Bat",
                date_of_birth: "1990-01-01",
                universe: "DC",
                main_power: "Intelligence",
                avatar_url: "https://example.com/batman.jpg",
            },
            headers: { "Content-Type": "application/json" },
        });

        expect(res.statusCode).toBe(400);
        const body = res.json();
        expect(body.success).toBe(false);
        expect(body.errors).toBeDefined();
    });

    it("POST /heroes: cria herói e formata datas (handler + mapper)", async () => {
        const created: Hero = {
            id: "abc",
            name: "Batman",
            nickname: "Bat",
            date_of_birth: new Date(1990, 0, 15, 12, 0, 0),
            universe: "DC",
            main_power: "Intelligence",
            avatar_url: "https://example.com/batman.jpg",
            is_active: true,
            created_at: new Date(2024, 0, 1, 10, 30, 0),
            updated_at: new Date(2024, 0, 2, 14, 0, 0),
        };

        mockCreateHero.mockResolvedValue(created);

        const res = await app.inject({
            method: "POST",
            url: "/heroes",
            payload: {
                name: "Batman",
                nickname: "Bat",
                date_of_birth: "1990-01-15",
                universe: "DC",
                main_power: "Intelligence",
                avatar_url: "https://example.com/batman.jpg",
            },
            headers: { "Content-Type": "application/json" },
        });

        expect(res.statusCode).toBe(201);
        const body = res.json();
        expect(body.id).toBe("abc");
        expect(body.date_of_birth).toBe("1990-01-15 12:00:00");
        expect(body.created_at).toBe("2024-01-01 10:30:00");
        expect(body.updated_at).toBe("2024-01-02 14:00:00");
    });

    it("GET /heroes: page inválida retorna 400 com mensagem do handler", async () => {
        const res = await app.inject({
            method: "GET",
            url: "/heroes?page=0",
        });

        expect(res.statusCode).toBe(400);
        const body = res.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Page must be an integer");
        expect(mockFindAllHeroes).toHaveBeenCalledTimes(0);
    });

    it("GET /heroes/:id: quando não existe, retorna 404 via error handler (exception do handler)", async () => {
        mockFindHeroById.mockResolvedValue(null);

        const res = await app.inject({
            method: "GET",
            url: "/heroes/does-not-exist",
        });

        expect(res.statusCode).toBe(404);
        const body = res.json();
        expect(body).toEqual({ message: "Hero not found" });
    });

    it("PUT /heroes/:id: herói inativo retorna 400 (handler -> controller)", async () => {
        const hero: Hero = {
            id: "abc",
            name: "Batman",
            nickname: "Bat",
            date_of_birth: new Date(1990, 0, 15, 12, 0, 0),
            universe: "DC",
            main_power: "Intelligence",
            avatar_url: "https://example.com/batman.jpg",
            is_active: false,
            created_at: new Date(2024, 0, 1, 10, 30, 0),
            updated_at: new Date(2024, 0, 2, 14, 0, 0),
        };

        mockFindHeroById.mockResolvedValue(hero);

        const res = await app.inject({
            method: "PUT",
            url: "/heroes/abc",
            payload: {},
            headers: { "Content-Type": "application/json" },
        });

        expect(res.statusCode).toBe(400);
        const body = res.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Inactive hero cannot be edited");
        expect(mockUpdateHeroById).toHaveBeenCalledTimes(0);
    });

    it("PUT /heroes/:id: payload inválido (Zod) retorna 400 com errors", async () => {
        const hero: Hero = {
            id: "abc",
            name: "Batman",
            nickname: "Bat",
            date_of_birth: new Date(1990, 0, 15, 12, 0, 0),
            universe: "DC",
            main_power: "Intelligence",
            avatar_url: "https://example.com/batman.jpg",
            is_active: true,
            created_at: new Date(2024, 0, 1, 10, 30, 0),
            updated_at: new Date(2024, 0, 2, 14, 0, 0),
        };

        mockFindHeroById.mockResolvedValue(hero);

        const res = await app.inject({
            method: "PUT",
            url: "/heroes/abc",
            payload: {
                name: "AB",
            },
            headers: { "Content-Type": "application/json" },
        });

        expect(res.statusCode).toBe(400);
        const body = res.json();
        expect(body.success).toBe(false);
        expect(body.errors).toBeDefined();
        expect(mockUpdateHeroById).toHaveBeenCalledTimes(0);
    });

    it("DELETE /heroes/:id: quando não existe, retorna 404 (exception do handler)", async () => {
        mockFindHeroById.mockResolvedValue(null);

        const res = await app.inject({
            method: "DELETE",
            url: "/heroes/abc",
        });

        expect(res.statusCode).toBe(404);
        const body = res.json();
        expect(body).toEqual({ message: "Hero not found" });
    });

    it("PATCH /heroes/:id/activate: ativa herói com 200", async () => {
        const hero: Hero = {
            id: "abc",
            name: "Batman",
            nickname: "Bat",
            date_of_birth: new Date(1990, 0, 15, 12, 0, 0),
            universe: "DC",
            main_power: "Intelligence",
            avatar_url: "https://example.com/batman.jpg",
            is_active: false,
            created_at: new Date(2024, 0, 1, 10, 30, 0),
            updated_at: new Date(2024, 0, 2, 14, 0, 0),
        };

        const activated: Hero = {
            ...hero,
            is_active: true,
            updated_at: new Date(2024, 0, 3, 0, 0, 0),
        };

        mockFindHeroById.mockResolvedValue(hero);
        mockUpdateHeroById.mockResolvedValue(activated);

        const res = await app.inject({
            method: "PATCH",
            url: "/heroes/abc/activate",
        });

        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body.success).toBeUndefined();
        expect(body.id).toBe("abc");
        expect(body.is_active).toBe(true);
        expect(body.updated_at).toBe("2024-01-03 00:00:00");
    });
});

