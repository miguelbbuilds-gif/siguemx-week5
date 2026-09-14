"use client";

import type { CaseStatus } from "@/lib/types";

export function DemoControls({
  status,
  onDeadline,
  onMissed,
  onVerify,
  onReset,
}: {
  status: CaseStatus;
  onDeadline: () => void;
  onMissed: () => void;
  onVerify: () => void;
  onReset: () => void;
}) {
  return (
    <section className="mt-8 rounded-[24px] border border-dashed border-teal-800/25 bg-white/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
        Controles de demo
      </p>
      <p className="mt-1 text-xs text-ink-500">
        Solo para la presentación. No forman parte del flujo de la paciente.
      </p>
      <div className="mt-3 grid gap-2">
        <button
          type="button"
          onClick={onDeadline}
          className="rounded-2xl bg-cream-100 px-4 py-3 text-left text-sm font-medium text-ink-800"
        >
          Simular fecha límite cercana
        </button>
        <button
          type="button"
          onClick={onMissed}
          className="rounded-2xl bg-cream-100 px-4 py-3 text-left text-sm font-medium text-ink-800"
        >
          Simular fecha límite vencida
        </button>
        <button
          type="button"
          onClick={onVerify}
          disabled={status !== "verification_pending"}
          className="rounded-2xl bg-cream-100 px-4 py-3 text-left text-sm font-medium text-ink-800 disabled:opacity-40"
        >
          Simular verificación de coordinadora
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-terracotta-700"
        >
          Borrar caso simulado
        </button>
      </div>
    </section>
  );
}
