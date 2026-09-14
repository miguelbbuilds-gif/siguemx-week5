"use client";

import { useRouter } from "next/navigation";
import { useDemoCase } from "@/components/CaseProvider";
import { PersonIcon } from "@/components/Icons";
import { RequireCase } from "@/components/RequireCase";
import {
  AppHeader,
  AppShell,
  Card,
  PersonaNote,
  PrimaryButton,
  SecondaryButton,
  SimulatedBanner,
  StatusPill,
} from "@/components/Ui";

function EscalationContent() {
  const router = useRouter();
  const { demoCase, simulateMissedDeadline } = useDemoCase();

  if (!demoCase) return null;

  const active = demoCase.status === "escalated";

  return (
    <AppShell>
      <AppHeader />
      <main className="pt-6">
        <SimulatedBanner />
        <h1 className="mt-4 text-3xl font-semibold text-ink-900">Escalamiento</h1>
        <div className="mt-4">
          <StatusPill label={active ? "ESCALAMIENTO ACTIVADO" : "ACTION NEEDED"} tone={active ? "warn" : "action"} />
        </div>
        <Card className="mt-6">
          <p className="text-lg font-semibold text-ink-900">
            {active
              ? "No pudimos confirmar tu cita antes de la fecha límite."
              : "Si la fecha límite pasa sin confirmar el siguiente paso, Ana escala el caso."}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 text-ink-500">
              <PersonIcon />
            </span>
            <div>
              <p className="font-semibold text-ink-900">{demoCase.coordinator.name}</p>
              <p className="text-sm text-ink-500">Sigue siendo la dueña del siguiente paso.</p>
            </div>
          </div>
        </Card>
        <div className="mt-8 space-y-3">
          {!active ? (
            <PrimaryButton type="button" onClick={simulateMissedDeadline}>
              Simular fecha límite vencida
            </PrimaryButton>
          ) : (
            <PrimaryButton type="button" onClick={() => router.push("/ayuda")}>
              Contactar a Ana ahora
            </PrimaryButton>
          )}
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

export default function EscalationPage() {
  return (
    <RequireCase>
      <EscalationContent />
    </RequireCase>
  );
}
