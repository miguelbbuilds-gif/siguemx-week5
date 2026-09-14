"use client";

import { useRouter } from "next/navigation";
import { useDemoCase } from "@/components/CaseProvider";
import { RequireCase } from "@/components/RequireCase";
import { AppHeader, AppShell, Card, PersonaNote, PrimaryButton, SecondaryButton, SimulatedBanner } from "@/components/Ui";

function HelpContent() {
  const router = useRouter();
  const { demoCase } = useDemoCase();

  if (!demoCase) return null;

  return (
    <AppShell>
      <AppHeader />
      <main className="pt-6">
        <SimulatedBanner />
        <h1 className="mt-4 text-3xl font-semibold text-ink-900">Necesito ayuda</h1>
        <Card className="mt-6 space-y-4">
          <p className="text-sm text-ink-500">Conversación simulada · no se envía a WhatsApp</p>
          <div className="rounded-3xl rounded-tl-md bg-cream-100 px-4 py-3 text-sm leading-6 text-ink-800">
            Hola Laura, soy Ana Martínez, tu coordinadora de cuidado. Puedo ayudarte a agendar la
            visita de confirmación antes del {demoCase.deadlineLabel}. Hay una opción de menor costo
            disponible.
          </div>
          <div className="ml-8 rounded-3xl rounded-tr-md bg-teal-800 px-4 py-3 text-sm leading-6 text-white">
            Hola Ana, necesito ayuda con el siguiente paso.
          </div>
        </Card>
        <p className="mt-4 text-sm text-ink-700">
          Esta pantalla no es un chatbot de síntomas y no ofrece consejo médico.
        </p>
        <div className="mt-8 space-y-3">
          <PrimaryButton type="button" onClick={() => router.push("/seguimiento")}>
            Registrar cómo voy
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

export default function HelpPage() {
  return (
    <RequireCase>
      <HelpContent />
    </RequireCase>
  );
}
