import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "/api";

export const api = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
});

export default api;
