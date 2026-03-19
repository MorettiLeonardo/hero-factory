import type { FastifyInstance } from "fastify";
import * as heroController from "../controllers/hero.controller";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createHeroSchema } from "../../../types/schemas/create-hero-schema";
import { updateHeroSchema } from "../../../types/schemas/update-hero-schema";

export async function heroRoutes(app: FastifyInstance) {
    const createHeroBodySchema = zodToJsonSchema(createHeroSchema, {
        $refStrategy: "none",
    });

    const updateHeroBodySchema = zodToJsonSchema(updateHeroSchema, {
        $refStrategy: "none",
    });

    const heroResponseSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            name: { type: "string" },
            nickname: { type: "string" },
            date_of_birth: { type: "string" },
            universe: { type: "string" },
            main_power: { type: "string" },
            avatar_url: { type: "string" },
            is_active: { type: "boolean" },
            created_at: { type: "string" },
            updated_at: { type: "string" },
        },
        required: [
            "id",
            "name",
            "nickname",
            "date_of_birth",
            "universe",
            "main_power",
            "avatar_url",
            "is_active",
            "created_at",
            "updated_at",
        ],
    } as const;

    const validationErrorResponseSchema = {
        type: "object",
        additionalProperties: true,
        properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            errors: { type: "object" },
        },
        required: ["message"],
    } as const;

    const exceptionErrorResponseSchema = {
        type: "object",
        additionalProperties: true,
        properties: {
            message: { type: "string" },
        },
        required: ["message"],
    } as const;

    app.post(
        "/heroes",
        {
            schema: {
                tags: ["Heroes"],
                summary: "Create a hero",
                body: createHeroBodySchema,
                response: {
                    201: heroResponseSchema,
                    400: validationErrorResponseSchema,
                },
            },
        },
        heroController.create
    );

    app.get(
        "/heroes",
        {
            schema: {
                tags: ["Heroes"],
                summary: "List heroes",
                querystring: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                        page: { type: "integer" },
                        search: { type: "string" },
                    },
                },
                response: {
                    200: {
                        type: "array",
                        items: heroResponseSchema,
                    },
                    400: validationErrorResponseSchema,
                },
            },
        },
        heroController.list
    );

    app.get(
        "/heroes/:id",
        {
            schema: {
                tags: ["Heroes"],
                summary: "Get hero by id",
                params: {
                    type: "object",
                    properties: { id: { type: "string" } },
                    required: ["id"],
                },
                response: {
                    200: heroResponseSchema,
                    404: exceptionErrorResponseSchema,
                    400: validationErrorResponseSchema,
                },
            },
        },
        heroController.getById
    );

    app.put(
        "/heroes/:id",
        {
            schema: {
                tags: ["Heroes"],
                summary: "Update a hero",
                params: {
                    type: "object",
                    properties: { id: { type: "string" } },
                    required: ["id"],
                },
                body: updateHeroBodySchema,
                response: {
                    200: heroResponseSchema,
                    400: validationErrorResponseSchema,
                    404: exceptionErrorResponseSchema,
                },
            },
        },
        heroController.update
    );

    app.patch(
        "/heroes/:id/activate",
        {
            schema: {
                tags: ["Heroes"],
                summary: "Activate a hero",
                params: {
                    type: "object",
                    properties: { id: { type: "string" } },
                    required: ["id"],
                },
                response: {
                    200: heroResponseSchema,
                    400: validationErrorResponseSchema,
                    404: exceptionErrorResponseSchema,
                },
            },
        },
        heroController.activate
    );

    app.patch(
        "/heroes/:id/deactivate",
        {
            schema: {
                tags: ["Heroes"],
                summary: "Deactivate a hero",
                params: {
                    type: "object",
                    properties: { id: { type: "string" } },
                    required: ["id"],
                },
                response: {
                    200: heroResponseSchema,
                    400: validationErrorResponseSchema,
                    404: exceptionErrorResponseSchema,
                },
            },
        },
        heroController.deactivate
    );

    app.delete(
        "/heroes/:id",
        {
            schema: {
                tags: ["Heroes"],
                summary: "Delete a hero",
                params: {
                    type: "object",
                    properties: { id: { type: "string" } },
                    required: ["id"],
                },
                response: {
                    204: { type: "null" },
                    404: exceptionErrorResponseSchema,
                    400: validationErrorResponseSchema,
                },
            },
        },
        heroController.remove
    );
}

