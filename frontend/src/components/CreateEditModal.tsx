import { X, Calendar } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { Hero } from "../services/heroService";

type Props = {
  open: boolean;
  hero?: Hero | null;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    nickname: string;
    date_of_birth: string;
    universe: string;
    main_power: string;
    avatar_url: string;
  }) => Promise<void>;
};

function dateToInput(d: string) {
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}

export function CreateEditModal({ open, hero, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [universe, setUniverse] = useState("");
  const [mainPower, setMainPower] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (hero) {
      setName(hero.name);
      setNickname(hero.nickname);
      setDateOfBirth(dateToInput(hero.date_of_birth));
      setUniverse(hero.universe);
      setMainPower(hero.main_power);
      setAvatarUrl(hero.avatar_url);
    } else {
      setName("");
      setNickname("");
      setDateOfBirth("");
      setUniverse("");
      setMainPower("");
      setAvatarUrl("");
    }
  }, [open, hero]);

  if (!open) return null;

  const isEdit = Boolean(hero);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name,
        nickname,
        date_of_birth: new Date(`${dateOfBirth}T12:00:00`).toISOString(),
        universe,
        main_power: mainPower,
        avatar_url: avatarUrl,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-xl"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className="mb-6 flex items-start justify-between">
          <h2 id="modal-title" className="text-xl font-bold text-[#002b7a]">
            {isEdit ? "Editar herói" : "Criar herói"}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nome completo">
            <input
              required
              minLength={3}
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome completo"
              className="w-full rounded-full border border-slate-200 px-5 py-3 text-[#002b7a] placeholder:text-slate-400 outline-none focus:border-[#002b7a]"
            />
          </Field>
          <Field label="Nome de guerra">
            <input
              required
              minLength={2}
              maxLength={30}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Digite o nome de guerra"
              className="w-full rounded-full border border-slate-200 px-5 py-3 text-[#002b7a] placeholder:text-slate-400 outline-none focus:border-[#002b7a]"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Data de nascimento">
              <div className="relative">
                <input
                  required
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-full border border-slate-200 px-5 py-3 pr-12 text-[#002b7a] outline-none focus:border-[#002b7a]"
                />
                <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </Field>
            <Field label="Universo">
              <input
                required
                value={universe}
                onChange={(e) => setUniverse(e.target.value)}
                placeholder="Digite o universo"
                className="w-full rounded-full border border-slate-200 px-5 py-3 text-[#002b7a] placeholder:text-slate-400 outline-none focus:border-[#002b7a]"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Habilidade">
              <input
                required
                minLength={2}
                maxLength={50}
                value={mainPower}
                onChange={(e) => setMainPower(e.target.value)}
                placeholder="Digite a habilidade"
                className="w-full rounded-full border border-slate-200 px-5 py-3 text-[#002b7a] placeholder:text-slate-400 outline-none focus:border-[#002b7a]"
              />
            </Field>
            <Field label="Avatar">
              <input
                required
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Digite a URL"
                className="w-full rounded-full border border-slate-200 px-5 py-3 text-[#002b7a] placeholder:text-slate-400 outline-none focus:border-[#002b7a]"
              />
            </Field>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-8 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#002b7a] px-8 py-3 font-medium text-white hover:bg-[#001f5c] disabled:opacity-60"
            >
              {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#002b7a]">
        {label}
      </label>
      {children}
    </div>
  );
}
