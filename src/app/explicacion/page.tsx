"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoCase } from "@/components/CaseProvider";
import { RequireCase } from "@/components/RequireCase";
import { AppHeader, AppShell, Card, PersonaNote, PrimaryButton, SecondaryButton, SimulatedBanner } from "@/components/Ui";
import { toExplanationPayload, type ExplanationResult } from "@/lib/explanation";

function ExplanationContent() {
  const router = useRouter();
  const { demoCase } = useDemoCase();
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!demoCase) return;

    const payload = toExplanationPayload(demoCase);
    fetch("/api/explicacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("bad");
        return (await response.json()) as ExplanationResult;
      })
      .then(setResult)
      .catch(() => setError("No se pudo generar la explicación. Usa el texto simulado de respaldo."));
  }, [demoCase]);

  if (!demoCase) return null;

  return (
    <AppShell>
      <AppHeader />
      <main className="pt-6">
        <SimulatedBanner />
        <h1 className="mt-4 text-3xl font-semibold text-ink-900">Qué significa este paso</h1>
        <Card className="mt-6 space-y-4">
          <p className="whitespace-pre-line text-base leading-7 text-ink-800">
            {result?.text ??
              "Tu resultado de detección sugiere un riesgo elevado de diabetes. Esto no es un diagnóstico.\n\nTu siguiente paso es agendar una visita de confirmación dentro de los próximos 3 días.\n\nAna, tu coordinadora de cuidado, te ayudará a completar este paso."}
          </p>
          {(result?.labels ?? ["Generado por IA con datos simulados.", "No es consejo médico."]).map((label) => (
            <p key={label} className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
              {label}
            </p>
          ))}
          {error ? <p className="text-sm text-terracotta-700">{error}</p> : null}
        </Card>
        <div className="mt-8 space-y-3">
          <PrimaryButton type="button" onClick={() => router.push("/seguimiento")}>
            Registrar seguimiento
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => router.push("/ruta")}>
            Volver a mi ruta
          </SecondaryButton>
        </div>
        <div className="mt-8">
          <PersonaNote />
        </div>
      </main>
    </AppShell>
  );
}

export default function ExplanationPage() {
  return (
    <RequireCase>
      <ExplanationContent />
    </RequireCase>
  );
}
