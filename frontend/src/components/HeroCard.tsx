import { MoreVertical, PencilLine, Trash } from "lucide-react";
import type { Hero } from "../services/heroService";
import { truncateText } from "../utils/utils";

type Props = {
  hero: Hero;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onOpenDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  deactivateLoading?: boolean;
};

export function HeroCard({
  hero,
  menuOpen,
  onToggleMenu,
  onOpenDetail,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  deactivateLoading = false,
}: Props) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onOpenDetail}
        className={`w-full rounded-3xl p-6 text-center shadow-sm transition hover:shadow-md ${hero.is_active ? "bg-white" : "bg-slate-200"
          }`}
      >
        <div className="relative mx-auto mb-4 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-slate-100">
          <img
            src={hero.avatar_url}
            alt={hero.nickname}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/160x160/e2e8f0/64748b?text=Hero";
            }}
          />
        </div>
        <p className="text-base font-semibold text-black">{truncateText(hero.nickname)}</p>
      </button>

      <div className="absolute right-2 top-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          aria-label="Menu"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              aria-hidden
              onClick={onToggleMenu}
            />
            <div
              className="absolute right-0 top-11 z-20 flex flex-col items-center gap-5 rounded-2xl bg-white p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onToggleMenu();
                }}
                className="flex items-center gap-3 text-red-500 hover:opacity-80"
                title="Excluir"
              >
                <Trash className="h-6 w-6" strokeWidth={1.5} />
              </button>

              <button
                type="button"
                onClick={() => {
                  onEdit();
                  onToggleMenu();
                }}
                className="flex items-center gap-3 text-black hover:opacity-80"
                title="Editar"
              >
                <PencilLine className="h-6 w-6" strokeWidth={1.5} />
              </button>

              <button
                type="button"
                role="switch"
                aria-checked={hero.is_active}
                disabled={deactivateLoading}
                onClick={() => {
                  if (hero.is_active) onDeactivate();
                  else onActivate();
                  onToggleMenu();
                }}
                className={`relative mx-auto h-7 w-12 rounded-full transition ${hero.is_active ? "bg-[#002b7a]" : "bg-slate-300"
                  } opacity-100 transition disabled:opacity-40`}
                title={hero.is_active ? "Desativar" : "Ativar"}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${hero.is_active ? "left-6" : "left-0.5"
                    }`}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
