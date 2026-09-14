"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoCase } from "@/components/CaseProvider";
import { DemoControls } from "@/components/DemoControls";
import {
  CalendarIcon,
  ChatIcon,
  ClockIcon,
  HelpIcon,
  LeafIcon,
  LockIcon,
  PersonIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { ProgressTrack } from "@/components/ProgressTrack";
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
import { STATUS_LABEL, type CaseStatus } from "@/lib/types";

function toneFor(status: CaseStatus) {
  if (status === "verified") return "done" as const;
  if (status === "verification_pending") return "pending" as const;
  if (status === "escalated") return "warn" as const;
  return "action" as const;
}

function CareRouteContent() {
  const router = useRouter();
  const {
    demoCase,
    resetCase,
    simulateDeadlineApproaching,
    simulateMissedDeadline,
  } = useDemoCase();

  if (!demoCase) return null;

  const status = demoCase.status;

  return (
    <AppShell>
      <AppHeader />
      <main className="pt-6">
        <SimulatedBanner />
        <h1 className="mt-4 text-3xl font-semibold text-ink-900">Tu ruta de cuidado</h1>
        <div className="mt-6">
          <ProgressTrack status={status} />
        </div>

        <Card className="mt-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-ink-500">
              <PersonIcon />
            </span>
            <div>
              <p className="text-lg font-semibold text-ink-900">{demoCase.coordinator.name}</p>
              <p className="text-sm text-ink-500">{demoCase.coordinator.role}</p>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-ink-700">
            <ChatIcon />
            Estoy aquí para acompañarte en cada paso.
          </p>
        </Card>

        <Card className="mt-3 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-800">
            <CalendarIcon />
          </span>
          <div>
            <p className="text-xs font-medium text-ink-500">Siguiente paso</p>
            <p className="text-lg font-semibold text-ink-900">{demoCase.nextAction}</p>
          </div>
        </Card>

        <Card className="mt-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-700">
              <CalendarIcon />
            </span>
            <div>
              <p className="text-xs font-medium text-terracotta-700">Fecha límite</p>
              <p className="text-lg font-semibold text-terracotta-700">{demoCase.deadlineLabel}</p>
            </div>
          </div>
          <span className="text-terracotta-700">
            <ClockIcon />
          </span>
        </Card>

        <Card className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-700">
              <LeafIcon />
            </span>
            <div>
              <p className="text-base font-semibold text-ink-900">{demoCase.affordability}</p>
              <p className="text-sm text-ink-500">Hablaremos de opciones que se ajusten a ti.</p>
            </div>
          </div>
          <StatusPill label={STATUS_LABEL[status]} tone={toneFor(status)} />
        </Card>

        {status === "deadline_approaching" ? (
          <p className="mt-4 text-sm font-medium text-terracotta-700">Tu fecha límite se acerca.</p>
        ) : null}
        {status === "escalated" ? (
          <p className="mt-4 text-sm font-medium text-red-800">
            No pudimos confirmar tu cita antes de la fecha límite. Ana sigue a cargo.
          </p>
        ) : null}
        {status === "verification_pending" ? (
          <p className="mt-4 text-sm font-medium text-amber-800">
            Tu coordinadora debe confirmar que el siguiente paso ocurrió.
          </p>
        ) : null}
        {status === "verified" ? (
          <p className="mt-4 text-sm font-medium text-teal-800">
            Ana confirmó la entrega. El siguiente paso ya tiene dueña.
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          <PrimaryButton type="button" onClick={() => router.push("/explicacion")}>
            Ver siguiente paso
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => router.push("/ayuda")}>
            <HelpIcon />
            Necesito ayuda
            <span className="ml-auto text-teal-800">
              <WhatsAppIcon />
            </span>
          </SecondaryButton>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Link className="rounded-2xl bg-white px-4 py-3 text-center font-medium text-teal-800 shadow-sm" href="/seguimiento">
            Check-in
          </Link>
          <Link className="rounded-2xl bg-white px-4 py-3 text-center font-medium text-teal-800 shadow-sm" href="/recordatorio">
            Recordatorio
          </Link>
        </div>

        <DemoControls
          status={status}
          onDeadline={() => {
            simulateDeadlineApproaching();
            router.push("/recordatorio");
          }}
          onMissed={() => {
            simulateMissedDeadline();
            router.push("/escalamiento");
          }}
          onVerify={() => {
            router.push("/verificacion");
          }}
          onReset={() => {
            resetCase();
            router.push("/");
          }}
        />

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-500">
          <LockIcon />
          Prototipo local. No se guardan datos reales de pacientes.
        </p>
        <div className="mt-3">
          <PersonaNote />
        </div>
      </main>
    </AppShell>
  );
}

export default function CareRoutePage() {
  return (
    <RequireCase>
      <CareRouteContent />
    </RequireCase>
  );
}
