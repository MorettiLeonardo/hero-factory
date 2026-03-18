import { HeroNotFoundError } from "../../domain/errors/hero-not-found.error";
import { deleteHeroById, findHeroById } from "../../infrastructure/repositories/hero.repository";
import type { Result } from "../../types/result";
import { findOrFail } from "../../utils/find-or-fail";

export async function deleteHeroAsync(id: string): Promise<Result<null, Error>> {
    if (!id) {
        return { success: false, error: new Error("ID is required") };
    }

    const hero = await findOrFail(
        () => findHeroById(id),
        new HeroNotFoundError()
    );

    await deleteHeroById(id);
    return { success: true, data: null };
}
