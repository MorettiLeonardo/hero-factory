import Fastify from "fastify";
import cors from "@fastify/cors";
import { heroRoutes } from "./interfaces/http/routes/hero.routes";
import "dotenv/config";

const app = Fastify();

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

app.listen({ port: 3000 }).then(async () => {
    console.log("Server running...");
});