import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Hero } from "../services/heroService";

type Props = {
  hero: Hero;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onOpenDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
};

export function HeroCard({
  hero,
  menuOpen,
  onToggleMenu,
  onOpenDetail,
  onEdit,
  onDelete,
  onToggleActive,
}: Props) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onOpenDetail}
        className="w-full rounded-3xl bg-white p-6 text-center shadow-sm transition hover:shadow-md"
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
        <p className="text-base font-semibold text-[#002b7a]">{hero.nickname}</p>
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
              className="absolute right-0 top-11 z-20 flex min-w-[3.5rem] flex-col gap-5 rounded-2xl bg-white p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onToggleMenu();
                }}
                className="flex justify-center text-red-500 hover:opacity-80"
                title="Excluir"
              >
                <Trash2 className="h-6 w-6" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => {
                  onEdit();
                  onToggleMenu();
                }}
                className="flex justify-center text-[#002b7a] hover:opacity-80"
                title="Editar"
              >
                <Pencil className="h-6 w-6" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={hero.is_active}
                onClick={() => onToggleActive()}
                className={`relative mx-auto h-7 w-12 rounded-full transition ${
                  hero.is_active ? "bg-[#002b7a]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                    hero.is_active ? "left-6" : "left-0.5"
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
