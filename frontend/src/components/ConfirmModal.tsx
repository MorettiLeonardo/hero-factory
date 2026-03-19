import { X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  const isDanger = variant === "danger";

  const confirmText = loading ? "Processando…" : confirmLabel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
        role="dialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <div className="mb-6 flex items-start justify-between">
          <h2 id="confirm-title" className="text-xl font-bold text-black">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p id="confirm-desc" className="mb-8 text-slate-600">
          {message}
        </p>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-slate-200 px-4 py-2 font-medium text-black hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void onConfirm()}
            className={`rounded-full px-4 py-2 font-medium ${isDanger
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-[#002b7a] text-white hover:bg-[#001f5c]"} disabled:opacity-60`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
