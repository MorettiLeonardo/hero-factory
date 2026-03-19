import api from "./api";

export type Hero = {
  id: string;
  name: string;
  nickname: string;
  date_of_birth: string;
  universe: string;
  main_power: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateHeroPayload = {
  name: string;
  nickname: string;
  date_of_birth: string;
  universe: string;
  main_power: string;
  avatar_url: string;
};

export type UpdateHeroPayload = Partial<CreateHeroPayload> & {
  avatar_url: string;
};

export async function listHeroes(page: number, search?: string) {
  const params: Record<string, string | number> = { page };
  if (search?.trim()) params.search = search.trim();
  const { data } = await api.get<Hero[]>("/heroes", { params });
  return data;
}

export async function getHeroById(id: string) {
  const { data } = await api.get<Hero>(`/heroes/${id}`);
  return data;
}

export async function createHero(body: CreateHeroPayload) {
  const { data } = await api.post<Hero>("/heroes", body, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function updateHero(id: string, body: UpdateHeroPayload) {
  const { data } = await api.put<Hero>(
    `/heroes/${encodeURIComponent(id)}`,
    body,
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
}

export async function deleteHero(id: string) {
  await api.delete(`/heroes/${encodeURIComponent(id)}`);
}

export async function activateHero(id: string) {
  const { data } = await api.patch<Hero>(
    `/heroes/${encodeURIComponent(id)}/activate`,
    {},
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
}

export async function deactivateHero(id: string) {
  const { data } = await api.patch<Hero>(
    `/heroes/${encodeURIComponent(id)}/deactivate`,
    {},
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
}
