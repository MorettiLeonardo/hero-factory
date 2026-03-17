import { ZodError } from "zod";

export function statusFromError(error: unknown): number {
    if (error instanceof Error && error.message === "Hero not found") return 404;
    return 400;
}

export function errorBody(error: unknown): { message: string; errors?: unknown } {
    if (error instanceof ZodError) {
        return {
            message: error.message,
            errors: error.format()
        };
    }
    if (error instanceof Error) {
        return { message: error.message };
    }
    return { message: String(error) };
}