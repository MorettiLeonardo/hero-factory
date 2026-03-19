import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { HeroCard } from "./components/HeroCard";
import { ConfirmModal } from "./components/ConfirmModal";
import { CreateEditModal } from "./components/CreateEditModal";
import { DetailModal } from "./components/DetailModal";
import {
  type Hero,
  listHeroes,
  createHero,
  updateHero,
  deleteHero,
  activateHero,
  deactivateHero,
} from "./services/heroService";

const PAGE_SIZE = 10;

function App() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuHeroId, setMenuHeroId] = useState<string | null>(null);
  const [detailHero, setDetailHero] = useState<Hero | null>(null);
  const [formModal, setFormModal] = useState<
    { mode: "create" } | { mode: "edit"; hero: Hero } | null
  >(null);
  const [deleteConfirmHeroId, setDeleteConfirmHeroId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listHeroes(page, search);
      setHeroes(data);
    } catch {
      setError("Não foi possível carregar os heróis. Verifique se a API está no ar.");
      setHeroes([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const hasNext = heroes.length === PAGE_SIZE;
  const pageNumbers: number[] = [];
  for (let p = 1; p <= page; p++) pageNumbers.push(p);
  if (hasNext) pageNumbers.push(page + 1);

  async function handleSaveCreateEdit(payload: {
    name: string;
    nickname: string;
    date_of_birth: string;
    universe: string;
    main_power: string;
    avatar_url: string;
  }) {
    if (formModal?.mode === "edit") {
      await updateHero(formModal.hero.id, payload);
    } else {
      await createHero(payload);
    }
    setFormModal(null);
    await load();
  }

  function openDeleteConfirm(id: string) {
    setMenuHeroId(null);
    setDeleteConfirmHeroId(id);
  }

  async function handleConfirmDelete() {
    if (!deleteConfirmHeroId) return;
    try {
      await deleteHero(deleteConfirmHeroId);
      setDeleteConfirmHeroId(null);
      if (heroes.length === 1 && page > 1) setPage((p) => p - 1);
      else await load();
    } catch {
      alert("Erro ao excluir.");
    }
  }

  async function handleToggleActive(hero: Hero) {
    try {
      if (hero.is_active) await deactivateHero(hero.id);
      else await activateHero(hero.id);
      await load();
    } catch {
      alert("Erro ao alterar status.");
    }
  }

  function handleBuscar() {
    setSearch(searchInput);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#fdf8f4] pb-24">
      <h1 className="pt-10 pb-8 text-center text-4xl font-bold tracking-tight text-[#002b7a]">
        Heróis
      </h1>

      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-4 px-4 sm:flex-row sm:items-center sm:gap-4">
        <button
          type="button"
          onClick={() => setFormModal({ mode: "create" })}
          className="shrink-0 rounded-full bg-[#002b7a] px-8 py-3 font-medium text-white hover:bg-[#001f5c]"
        >
          Criar
        </button>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
            placeholder="Digite o nome do herói"
            className="w-full rounded-full border border-slate-200/80 bg-white py-3 pl-14 pr-5 text-[#002b7a] placeholder:text-slate-400 shadow-sm outline-none focus:border-[#002b7a]/30"
          />
        </div>
        <button
          type="button"
          onClick={handleBuscar}
          className="shrink-0 rounded-full border border-slate-200 bg-white px-8 py-3 font-medium text-[#002b7a] shadow-sm hover:bg-slate-50"
        >
          Buscar
        </button>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4">
        {error && (
          <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-red-700">
            {error}
          </p>
        )}
        {loading ? (
          <p className="py-16 text-center text-slate-500">Carregando…</p>
        ) : heroes.length === 0 ? (
          <p className="py-16 text-center text-slate-500">Nenhum herói encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {heroes.map((hero) => (
              <HeroCard
                key={hero.id}
                hero={hero}
                menuOpen={menuHeroId === hero.id}
                onToggleMenu={() =>
                  setMenuHeroId((id) => (id === hero.id ? null : hero.id))
                }
                onOpenDetail={() => {
                  setMenuHeroId(null);
                  setDetailHero(hero);
                }}
                onEdit={() => setFormModal({ mode: "edit", hero })}
                onDelete={() => openDeleteConfirm(hero.id)}
                onToggleActive={() => handleToggleActive(hero)}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && heroes.length > 0 && (
        <div className="fixed bottom-8 right-8 flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {pageNumbers.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPage(num)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium ${
                num === page
                  ? "bg-sky-100 text-[#002b7a]"
                  : "text-slate-500 hover:bg-white"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm disabled:opacity-40"
            aria-label="Próxima página"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      <CreateEditModal
        open={formModal !== null}
        hero={formModal?.mode === "edit" ? formModal.hero : null}
        onClose={() => setFormModal(null)}
        onSave={handleSaveCreateEdit}
      />

      {detailHero && (
        <DetailModal hero={detailHero} onClose={() => setDetailHero(null)} />
      )}

      <ConfirmModal
        open={deleteConfirmHeroId !== null}
        title="Excluir herói"
        message="Tem certeza que deseja excluir este herói? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmHeroId(null)}
      />
    </div>
  );
}

export default App;
