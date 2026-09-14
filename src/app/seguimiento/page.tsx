"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChoiceGroup } from "@/components/ChoiceGroup";
import { useDemoCase } from "@/components/CaseProvider";
import { RequireCase } from "@/components/RequireCase";
import { AppHeader, AppShell, PersonaNote, PrimaryButton, SecondaryButton, SimulatedBanner } from "@/components/Ui";
import {
  APPOINTMENT_OPTIONS,
  ATTENDED_OPTIONS,
  CONTACTED_OPTIONS,
  type AttendedAppointment,
  type ContactedClinic,
  type HasAppointment,
} from "@/lib/types";

function FollowUpContent() {
  const router = useRouter();
  const { demoCase, saveCheckIn } = useDemoCase();
  const [contactedClinic, setContactedClinic] = useState<ContactedClinic | "">(
    demoCase?.checkIn.contactedClinic ?? "",
  );
  const [hasAppointment, setHasAppointment] = useState<HasAppointment | "">(
    demoCase?.checkIn.hasAppointment ?? "",
  );
  const [attended, setAttended] = useState<AttendedAppointment | "">(demoCase?.checkIn.attended ?? "");
  const [error, setError] = useState("");
  const [missing, setMissing] = useState<string[]>([]);

  function submit() {
    const result = saveCheckIn({
      contactedClinic: contactedClinic || undefined,
      hasAppointment: hasAppointment || undefined,
      attended: attended || undefined,
    });

    if (!result.ok) {
      setError(result.message);
      setMissing(result.missing);
      return;
    }

    const wentToAppointment = attended === "si";
    router.push(wentToAppointment ? "/verificacion" : "/ruta");
  }

  return (
    <AppShell>
      <AppHeader />
      <main className="pt-6">
        <SimulatedBanner />
        <h1 className="mt-4 text-3xl font-semibold text-ink-900">Seguimiento</h1>
        <p className="mt-3 text-sm leading-6 text-ink-700">
          Responde solo con las opciones. No pedimos texto libre ni síntomas.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <ChoiceGroup
            legend="¿Pudiste contactar a la clínica?"
            name="contactedClinic"
            value={contactedClinic}
            options={CONTACTED_OPTIONS}
            onChange={setContactedClinic}
            error={missing.includes("contactedClinic")}
          />
          <ChoiceGroup
            legend="¿Ya tienes una cita?"
            name="hasAppointment"
            value={hasAppointment}
            options={APPOINTMENT_OPTIONS}
            onChange={setHasAppointment}
            error={missing.includes("hasAppointment")}
          />
          <ChoiceGroup
            legend="¿Asististe a la cita?"
            name="attended"
            value={attended}
            options={ATTENDED_OPTIONS}
            onChange={setAttended}
            error={missing.includes("attended")}
          />

          {error ? (
            <p className="rounded-2xl bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700" role="alert">
              {error}
            </p>
          ) : null}

          <PrimaryButton type="submit">Guardar respuestas</PrimaryButton>
          <SecondaryButton type="button" onClick={() => router.push("/ruta")}>
            Cancelar
          </SecondaryButton>
        </form>
        <div className="mt-8">
          <PersonaNote />
        </div>
      </main>
    </AppShell>
  );
}

export default function FollowUpPage() {
  return (
    <RequireCase>
      <FollowUpContent />
    </RequireCase>
  );
}
