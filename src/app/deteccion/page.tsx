"use client";

import { useRouter } from "next/navigation";
import { RequireCase } from "@/components/RequireCase";
import { AppHeader, AppShell, Card, PersonaNote, PrimaryButton, SimulatedBanner } from "@/components/Ui";

function ScreeningContent() {
  const router = useRouter();

  return (
    <AppShell>
      <AppHeader />
      <main className="pt-8">
        <SimulatedBanner />
        <h1 className="mt-4 text-3xl font-semibold text-ink-900">Tu resultado de detección</h1>
        <Card className="mt-6">
          <p className="text-xs font-bold tracking-[0.16em] text-terracotta-700">SIMULADO</p>
          <p className="mt-3 text-2xl font-semibold text-ink-900">Riesgo elevado de diabetes</p>
          <p className="mt-4 text-sm leading-6 text-ink-700">
            Este resultado no es un diagnóstico.
          </p>
          <p className="mt-3 text-sm leading-6 text-ink-700">
            El siguiente paso es una visita de confirmación. Alguien te va a acompañar para que
            ese paso no se quede solo en un resultado.
          </p>
        </Card>
        <div className="mt-8">
          <PrimaryButton type="button" onClick={() => router.push("/ruta")}>
            Ver mi plan de seguimiento
          </PrimaryButton>
        </div>
        <div className="mt-8">
          <PersonaNote />
        </div>
      </main>
    </AppShell>
  );
}

export default function ScreeningPage() {
  return (
    <RequireCase>
      <ScreeningContent />
    </RequireCase>
  );
}
