import { X, Calendar } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { Hero } from "../services/heroService";
import { dateToInput, formatDisplayDate } from "../utils/utils";

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

export function CreateEditModal({ open, hero, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [universe, setUniverse] = useState("");
  const [mainPower, setMainPower] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [dateError, setDateError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!open) return;
    setDateError("");
    setSaveError("");
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
  const isEditDisabled = isEdit && hero != null && !hero.is_active;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isEditDisabled) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    if (dateOfBirth >= todayStr) {
      setDateError("Data de nascimento deve ser anterior a hoje.");
      return;
    }
    setDateError("");
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
    } catch {
      setSaveError("Erro ao salvar. Tente novamente.");
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
          <h2 id="modal-title" className="text-xl font-bold text-black">
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

        {isEdit && hero && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <p className="font-semibold text-black">ID</p>
                <p className="mt-1 text-slate-600">{hero.id}</p>
              </div>
              <div>
                <p className="font-semibold text-black">Status</p>
                <p className="mt-1 text-slate-600">
                  {hero.is_active ? "Ativo" : "Desativado"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-black">Criado em</p>
                <p className="mt-1 text-slate-600">
                  {formatDisplayDate(hero.created_at)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-black">Atualizado em</p>
                <p className="mt-1 text-slate-600">
                  {formatDisplayDate(hero.updated_at)}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditDisabled && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-medium text-amber-900">
                Heróis desativados não podem ser editados.
              </p>
            </div>
          )}
          {saveError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">{saveError}</p>
            </div>
          )}
          <Field label="Nome completo">
            <input
              required
              minLength={3}
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome completo"
              disabled={saving || isEditDisabled}
              className="w-full rounded-full border border-slate-200 px-5 py-3 text-black placeholder:text-slate-400 outline-none focus:border-[#002b7a]"
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
              disabled={saving || isEditDisabled}
              className="w-full rounded-full border border-slate-200 px-5 py-3 text-black placeholder:text-slate-400 outline-none focus:border-[#002b7a]"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Data de nascimento">
              <div className="relative">
                <input
                  required
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    setDateError("");
                  }}
                  disabled={saving || isEditDisabled}
                  className={`w-full rounded-full border px-5 py-3 pr-12 text-black outline-none focus:border-[#002b7a] ${dateError ? "border-red-500" : "border-slate-200"
                    }`}
                />
                <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
              {dateError && (
                <p className="mt-1.5 text-sm text-red-600" role="alert">
                  {dateError}
                </p>
              )}
            </Field>
            <Field label="Universo">
              <input
                required
                value={universe}
                onChange={(e) => setUniverse(e.target.value)}
                placeholder="Digite o universo"
                disabled={saving || isEditDisabled}
                className="w-full rounded-full border border-slate-200 px-5 py-3 text-black placeholder:text-slate-400 outline-none focus:border-[#002b7a]"
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
                disabled={saving || isEditDisabled}
                className="w-full rounded-full border border-slate-200 px-5 py-3 text-black placeholder:text-slate-400 outline-none focus:border-[#002b7a]"
              />
            </Field>
            <Field label="Avatar">
              <input
                required
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Digite a URL"
                disabled={saving || isEditDisabled}
                className="w-full rounded-full border border-slate-200 px-5 py-3 text-black placeholder:text-slate-400 outline-none focus:border-[#002b7a]"
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
              disabled={saving || isEditDisabled}
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
      <label className="mb-1.5 block text-sm font-medium text-black">
        {label}
      </label>
      {children}
    </div>
  );
}
