import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "/api";

/** Sem Content-Type padrão: no Fastify v5, DELETE com `application/json` e corpo vazio falha. */
export const api = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
});

export default api;
