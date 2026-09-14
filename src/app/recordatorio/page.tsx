"use client";

import { useRouter } from "next/navigation";
import { useDemoCase } from "@/components/CaseProvider";
import { RequireCase } from "@/components/RequireCase";
import { AppHeader, AppShell, Card, PersonaNote, PrimaryButton, SecondaryButton, SimulatedBanner } from "@/components/Ui";

function ReminderContent() {
  const router = useRouter();
  const { demoCase, markAppointment, simulateDeadlineApproaching } = useDemoCase();

  if (!demoCase) return null;

  return (
    <AppShell>
      <AppHeader />
      <main className="pt-6">
        <SimulatedBanner />
        <h1 className="mt-4 text-3xl font-semibold text-ink-900">Recordatorio</h1>
        <Card className="mt-6">
          <p className="text-xl font-semibold text-terracotta-700">Tu fecha límite se acerca.</p>
          <p className="mt-3 text-sm leading-6 text-ink-700">
            Tienes hasta el {demoCase.deadlineLabel} para {demoCase.nextAction.toLowerCase()}.
            Ana Martínez sigue siendo la persona responsable de este paso.
          </p>
        </Card>
        <div className="mt-8 space-y-3">
          <PrimaryButton type="button" onClick={() => router.push("/ayuda")}>
            Contactar a Ana
          </PrimaryButton>
          <SecondaryButton
            type="button"
            onClick={() => {
              markAppointment();
              router.push("/ruta");
            }}
          >
            Ya tengo mi cita
          </SecondaryButton>
          {demoCase.status !== "deadline_approaching" ? (
            <button
              type="button"
              className="w-full text-center text-sm font-medium text-teal-800"
              onClick={simulateDeadlineApproaching}
            >
              Activar estado de fecha límite cercana
            </button>
          ) : null}
        </div>
        <div className="mt-8">
          <PersonaNote />
        </div>
      </main>
    </AppShell>
  );
}

export default function ReminderPage() {
  return (
    <RequireCase>
      <ReminderContent />
    </RequireCase>
  );
}
