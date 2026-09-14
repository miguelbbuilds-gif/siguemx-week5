"use client";

import { useRouter } from "next/navigation";
import { useDemoCase } from "@/components/CaseProvider";
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

function VerificationContent() {
  const router = useRouter();
  const { demoCase, simulateCoordinatorVerification } = useDemoCase();

  if (!demoCase) return null;

  const pending = demoCase.status === "verification_pending";
  const verified = demoCase.status === "verified";

  return (
    <AppShell>
      <AppHeader />
      <main className="pt-6">
        <SimulatedBanner />
        <h1 className="mt-4 text-3xl font-semibold text-ink-900">Verificación</h1>
        <div className="mt-4">
          <StatusPill
            label={verified ? "PASO VERIFICADO" : pending ? "VERIFICACIÓN PENDIENTE" : "ACTION NEEDED"}
            tone={verified ? "done" : pending ? "pending" : "action"}
          />
        </div>
        <Card className="mt-6 space-y-4">
          {verified ? (
            <>
              <p className="text-lg font-semibold text-ink-900">
                Ana Martínez confirmó que el siguiente paso ocurrió.
              </p>
              <p className="text-sm leading-6 text-ink-700">
                El reporte de la paciente no cerró el caso. Solo la verificación de la coordinadora
                cambió el estado a PASO VERIFICADO.
              </p>
            </>
          ) : pending ? (
            <>
              <p className="text-lg font-semibold text-ink-900">
                Tu coordinadora debe confirmar que el siguiente paso ocurrió.
              </p>
              <p className="text-sm leading-6 text-ink-700">
                Reportaste asistencia. Eso no cierra el caso. El estado es VERIFICACIÓN PENDIENTE
                hasta que Ana lo confirme.
              </p>
            </>
          ) : (
            <p className="text-sm leading-6 text-ink-700">
              Cuando reportes que asististe a la cita, el caso pasará a verificación pendiente. No se
              marcará como completo de forma automática.
            </p>
          )}
        </Card>

        <div className="mt-8 space-y-3">
          {pending ? (
            <div className="rounded-[24px] border border-dashed border-teal-800/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
                Control de demo · coordinadora
              </p>
              <PrimaryButton
                type="button"
                className="mt-3"
                onClick={() => simulateCoordinatorVerification()}
              >
                Simular verificación de coordinadora
              </PrimaryButton>
            </div>
          ) : null}
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

export default function VerificationPage() {
  return (
    <RequireCase>
      <VerificationContent />
    </RequireCase>
  );
}
