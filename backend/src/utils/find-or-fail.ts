export async function findOrFail<T>(
    fn: () => Promise<T | null>,
    error: Error
): Promise<T> {
    const result = await fn();

    if (!result) {
        throw error;
    }

    return result;
}