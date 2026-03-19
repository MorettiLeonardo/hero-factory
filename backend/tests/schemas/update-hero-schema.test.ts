import { describe, it, expect } from "vitest";
import { updateHeroSchema } from "../../src/types/schemas/update-hero-schema";

describe("updateHeroSchema", () => {
    it("acept only avatar_url", () => {
        const result = updateHeroSchema.safeParse({
            avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.avatar_url).toBe("https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg");
        }
    });

    it("accepts all optional fields when filled", () => {
        const payload = {
            name: "Robert Bruce Banner",
            nickname: "Hulk",
            date_of_birth: "1962-04-10",
            universe: "Marvel",
            main_power: "Force",
            avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
        };
        const result = updateHeroSchema.safeParse(payload);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.name).toBe(payload.name);
            expect(result.data.nickname).toBe(payload.nickname);
            expect(result.data.universe).toBe(payload.universe);
            expect(result.data.main_power).toBe(payload.main_power);
            expect(result.data.avatar_url).toBe(payload.avatar_url);
            expect(result.data.date_of_birth).toBeInstanceOf(Date);
        }
    });

    it("rejects when avatar_url is missing", () => {
        const result = updateHeroSchema.safeParse({});
        expect(result.success).toBe(false);
    });

    describe("name (opcional)", () => {
        it("rejects when present and with fewer than 3 characters", () => {
            const result = updateHeroSchema.safeParse({
                name: "AB",
                avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
            });
            expect(result.success).toBe(false);
        });

        it("accepts when present with 3 to 50 characters", () => {
            const result = updateHeroSchema.safeParse({
                name: "Batman",
                avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
            });
            expect(result.success).toBe(true);
        });
    });

    describe("nickname (opcional)", () => {
        it("rejects when present and with fewer than 2 characters", () => {
            const result = updateHeroSchema.safeParse({
                nickname: "B",
                avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
            });
            expect(result.success).toBe(false);
        });
    });

    describe("main_power (opcional)", () => {
        it("rejects when present and with fewer than 2 characters", () => {
            const result = updateHeroSchema.safeParse({
                main_power: "X",
                avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
            });
            expect(result.success).toBe(false);
        });

        it("rejects when present and with more than 50 characters", () => {
            const result = updateHeroSchema.safeParse({
                main_power: "A".repeat(51),
                avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
            });
            expect(result.success).toBe(false);
        });
    });

    describe("date_of_birth (opcional)", () => {
        it("rejects when present and in the future", () => {
            const future = new Date();
            future.setFullYear(future.getFullYear() + 1);
            const result = updateHeroSchema.safeParse({
                date_of_birth: future.toISOString(),
                avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some((i) => i.message?.includes("future"))).toBe(true);
            }
        });

        it("accepts when present and in the past", () => {
            const result = updateHeroSchema.safeParse({
                date_of_birth: "1990-01-01",
                avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
            });
            expect(result.success).toBe(true);
        });
    });

    describe("strict", () => {
        it("rejects extra fields", () => {
            const result = updateHeroSchema.safeParse({
                avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
                unknown_key: "não permitido",
            });
            expect(result.success).toBe(false);
        });
    });
});
