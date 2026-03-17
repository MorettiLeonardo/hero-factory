import { deleteHeroById, findHeroById } from "../../infrastructure/repositories/hero.repository";
import type { Result } from "../../types/result";

export async function deleteHeroAsync(id: string): Promise<Result<null, Error>> {
    if (!id) {
        return { success: false, error: new Error("ID is required") };
    }

    const hero = await findHeroById(id);

    if (!hero) {
        return { success: false, error: new Error("Hero not found") };
    }

    await deleteHeroById(id);
    return { success: true, data: null };
}
