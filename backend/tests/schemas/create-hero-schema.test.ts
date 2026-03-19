import { describe, it, expect } from "vitest";
import { createHeroSchema } from "../../src/types/schemas/create-hero-schema";

const validPayload = {
    name: "Robert Bruce Banner",
    nickname: "Hulk",
    date_of_birth: "1962-04-10",
    universe: "Marvel",
    main_power: "Force",
    avatar_url: "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
};

describe("createHeroSchema", () => {
    it("acept valid payload", () => {
        const result = createHeroSchema.safeParse(validPayload);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.name).toBe(validPayload.name);
            expect(result.data.nickname).toBe(validPayload.nickname);
            expect(result.data.avatar_url).toBe(validPayload.avatar_url);
        }
    });

    describe("name", () => {
        it("rejects when name has less than 3 characters", () => {
            const result = createHeroSchema.safeParse({ ...validPayload, name: "AB" });
            expect(result.success).toBe(false);
        });

        it("accepts exactly 3 characters", () => {
            const result = createHeroSchema.safeParse({ ...validPayload, name: "Bat" });
            expect(result.success).toBe(true);
        });

        it("accepts up to 50 characters", () => {
            const name = "A".repeat(50);
            const result = createHeroSchema.safeParse({ ...validPayload, name });
            expect(result.success).toBe(true);
        });

        it("rejects when name has more than 50 characters", () => {
            const result = createHeroSchema.safeParse({ ...validPayload, name: "A".repeat(51) });
            expect(result.success).toBe(false);
        });

        it("rejects when name is missing", () => {
            const { name: _, ...rest } = validPayload;
            const result = createHeroSchema.safeParse(rest);
            expect(result.success).toBe(false);
        });
    });

    describe("nickname", () => {
        it("rejects when nickname has less than 2 characters", () => {
            const result = createHeroSchema.safeParse({ ...validPayload, nickname: "B" });
            expect(result.success).toBe(false);
        });

        it("accepts exactly 2 characters", () => {
            const result = createHeroSchema.safeParse({ ...validPayload, nickname: "Ba" });
            expect(result.success).toBe(true);
        });

        it("accepts up to 30 characters", () => {
            const nickname = "A".repeat(30);
            const result = createHeroSchema.safeParse({ ...validPayload, nickname });
            expect(result.success).toBe(true);
        });

        it("rejects when nickname has more than 30 characters", () => {
            const result = createHeroSchema.safeParse({ ...validPayload, nickname: "A".repeat(31) });
            expect(result.success).toBe(false);
        });
    });

    describe("date_of_birth", () => {
        it("rejects date in the future", () => {
            const future = new Date();
            future.setFullYear(future.getFullYear() + 1);
            const result = createHeroSchema.safeParse({
                ...validPayload,
                date_of_birth: future.toISOString(),
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some((i) => i.message?.includes("future"))).toBe(true);
            }
        });

        it("accepts date in the past", () => {
            const result = createHeroSchema.safeParse({
                ...validPayload,
                date_of_birth: "1990-01-01",
            });
            expect(result.success).toBe(true);
        });

        it("accepts today's date", () => {
            const today = new Date().toISOString().split("T")[0];
            const result = createHeroSchema.safeParse({
                ...validPayload,
                date_of_birth: today,
            });
            expect(result.success).toBe(true);
        });

        it("rejects when date_of_birth is missing", () => {
            const { date_of_birth: _, ...rest } = validPayload;
            const result = createHeroSchema.safeParse(rest);
            expect(result.success).toBe(false);
        });
    });

    describe("main_power", () => {
        it("rejects when main_power has less than 2 characters", () => {
            const result = createHeroSchema.safeParse({ ...validPayload, main_power: "X" });
            expect(result.success).toBe(false);
        });

        it("accepts exactly 2 characters", () => {
            const result = createHeroSchema.safeParse({ ...validPayload, main_power: "XX" });
            expect(result.success).toBe(true);
        });

        it("rejects when main_power has more than 50 characters", () => {
            const result = createHeroSchema.safeParse({ ...validPayload, main_power: "A".repeat(51) });
            expect(result.success).toBe(false);
        });
    });

    describe("strict", () => {
        it("rejects extra fields", () => {
            const result = createHeroSchema.safeParse({
                ...validPayload,
                extra_field: "not allowed",
            });
            expect(result.success).toBe(false);
        });
    });

    describe("campos obrigatórios", () => {
        it("rejects when universe is missing", () => {
            const { universe: _, ...rest } = validPayload;
            const result = createHeroSchema.safeParse(rest);
            expect(result.success).toBe(false);
        });

        it("rejects when avatar_url is missing", () => {
            const { avatar_url: _, ...rest } = validPayload;
            const result = createHeroSchema.safeParse(rest);
            expect(result.success).toBe(false);
        });
    });
});
