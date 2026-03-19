import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { heroRoutes } from "./interfaces/http/routes/hero.routes";
import "dotenv/config";

const app = Fastify();

app.register(swagger, {
    openapi: {
        info: {
            title: "HeroFactory API",
            version: "1.0.0",
        },
    },
});

app.register(swaggerUi, {
    routePrefix: "/docs",
});

app.register(cors, {
    origin: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
});
app.register(heroRoutes);

app.setErrorHandler((error: Error, _, reply) => {
    const status = error.message === "Hero not found" ? 404 : 400;
    return reply.status(status).send({
        message: error.message
    });
});

app.listen({ port: 3000, host: "0.0.0.0" }).then(async () => {
    console.log("Server running...");
});