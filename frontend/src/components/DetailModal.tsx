import { X } from "lucide-react";
import type { Hero } from "../services/heroService";
import { truncateText } from "../utils/utils";

type Props = {
  hero: Hero | null;
  onClose: () => void;
};

function formatDisplayDate(s: string) {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return s;
}

export function DetailModal({ hero, onClose }: Props) {
  if (!hero) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl"
        role="dialog"
        aria-labelledby="detail-title"
      >
        <div className="mb-6 flex items-start justify-between">
          <h2 id="detail-title" className="text-xl font-bold text-[#002b7a]">
            {hero.nickname}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-8 flex justify-center">
          <img
            src={hero.avatar_url}
            alt=""
            className="h-40 w-40 rounded-full object-cover ring-4 ring-slate-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/160x160/e2e8f0/64748b?text=Hero";
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold text-[#002b7a]">Nome completo</p>
            <p className="mt-1 text-slate-600">{truncateText(hero.name)}</p>
          </div>
          <div>
            <p className="font-semibold text-[#002b7a]">Data de nascimento</p>
            <p className="mt-1 text-slate-600">{formatDisplayDate(hero.date_of_birth)}</p>
          </div>
          <div>
            <p className="font-semibold text-[#002b7a]">Universo</p>
            <p className="mt-1 text-slate-600">{truncateText(hero.universe)}</p>
          </div>
          <div>
            <p className="font-semibold text-[#002b7a]">Habilidade</p>
            <p className="mt-1 text-slate-600">{truncateText(hero.main_power)}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-10 py-3 font-medium text-[#002b7a] hover:bg-slate-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
