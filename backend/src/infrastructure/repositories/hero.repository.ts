import z from "zod";
import type { Hero } from "../../domain/entities/hero";
import { prisma } from "../database/prisma";
import { createHeroSchema } from "../../types/schemas/create-hero-schema";

export async function createHero(data: z.infer<typeof createHeroSchema>): Promise<Hero> {
    return await prisma.hero.create({
        data: {
            ...data,
            is_active: true,
            date_of_birth: new Date(data.date_of_birth),
        },
    });
}

export async function findAllHeroes(page: number, search?: string): Promise<Hero[]> {
    return await prisma.hero.findMany({
        where: search
            ? {
                OR: [
                    { name: { contains: search } },
                    { nickname: { contains: search } }
                ]
            }
            : {},
        orderBy: { created_at: "desc" },
        skip: (page - 1) * 10,
        take: 10
    });
}

export async function findHeroById(id: string): Promise<Hero | null> {
    return await prisma.hero.findUnique({ where: { id } });
}

export async function updateHeroById(id: string, data: Partial<Hero>): Promise<Hero> {
    return await prisma.hero.update({
        where: { id },
        data
    })
}

export async function deleteHeroById(id: string): Promise<void> {
    await prisma.hero.delete({ where: { id } });
}