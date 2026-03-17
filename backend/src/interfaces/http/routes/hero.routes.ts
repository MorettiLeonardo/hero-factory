import type { FastifyInstance } from "fastify";
import * as heroController from "../controllers/hero.controller";

export async function heroRoutes(app: FastifyInstance) {
    app.post("/heroes", heroController.create);
    app.get("/heroes", heroController.list);
    app.get("/heroes/:id", heroController.getById);
    app.put("/heroes/:id", heroController.update);
    app.patch("/heroes/:id/activate", heroController.activate);
    app.patch("/heroes/:id/deactivate", heroController.deactivate);
    app.delete("/heroes/:id", heroController.remove);
}

