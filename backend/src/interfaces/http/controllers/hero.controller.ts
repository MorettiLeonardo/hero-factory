import type { FastifyRequest, FastifyReply } from "fastify";
import { errorBody, statusFromError } from "../../../utils/error";
import { listHeroesAsync } from "../../../application/hero-handler/list-heroes";
import { getHeroByIdAsync } from "../../../application/hero-handler/get-hero-by-id";
import { updateHeroAsync } from "../../../application/hero-handler/update-hero";
import { activateHeroAsync } from "../../../application/hero-handler/activate-hero";
import { deactivateHeroAsync } from "../../../application/hero-handler/deactivate-hero";
import { createHeroAsync } from "../../../application/hero-handler/create-hero";
import { deleteHeroAsync } from "../../../application/hero-handler/delete-hero";

export async function create(req: FastifyRequest, reply: FastifyReply) {
    const result = await createHeroAsync(req.body);

    if (!result.success) {
        return reply.status(statusFromError(result.error)).send({
            success: false,
            ...errorBody(result.error)
        });
    }

    return reply.status(201).send(result.data);
}

export async function list(req: FastifyRequest, reply: FastifyReply) {
    const { page = 1, search } = req.query as { page?: number; search?: string };

    const result = await listHeroesAsync(Number(page), search);

    if (!result.success) {
        return reply.status(statusFromError(result.error)).send({
            success: false,
            ...errorBody(result.error)
        });
    }

    return reply.status(200).send(result.data);
}

export async function getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const result = await getHeroByIdAsync(id);

    if (!result.success) {
        return reply.status(statusFromError(result.error)).send({
            success: false,
            ...errorBody(result.error)
        });
    }

    return reply.status(200).send(result.data);
}

export async function update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const result = await updateHeroAsync(id, req.body);

    if (!result.success) {
        return reply.status(statusFromError(result.error)).send({
            success: false,
            ...errorBody(result.error)
        });
    }

    return reply.status(200).send(result.data);
}

export async function activate(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const result = await activateHeroAsync(id);

    if (!result.success) {
        return reply.status(statusFromError(result.error)).send({
            success: false,
            ...errorBody(result.error)
        });
    }

    return reply.status(200).send(result.data);
}

export async function deactivate(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const result = await deactivateHeroAsync(id);

    if (!result.success) {
        return reply.status(statusFromError(result.error)).send({
            success: false,
            ...errorBody(result.error)
        });
    }

    return reply.status(200).send(result.data);
}

export async function remove(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const result = await deleteHeroAsync(id);

    if (!result.success) {
        return reply.status(statusFromError(result.error)).send({
            success: false,
            ...errorBody(result.error)
        });
    }

    return reply.status(204).send();
}
