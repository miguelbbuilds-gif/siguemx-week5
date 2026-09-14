"use client";

import { useRouter } from "next/navigation";
import {
  AppHeader,
  AppShell,
  Card,
  PersonaNote,
  PrimaryButton,
  SecondaryButton,
} from "@/components/Ui";
import { BellIcon, HeartIcon, ListIcon, PersonIcon } from "@/components/Icons";
import { useDemoCase } from "@/components/CaseProvider";

const benefits = [
  { title: "Un plan claro", icon: ListIcon },
  { title: "Una persona que te apoya", icon: PersonIcon },
  { title: "Recordatorios", icon: BellIcon },
  { title: "Seguimiento", icon: HeartIcon },
];

export default function LandingPage() {
  const router = useRouter();
  const { demoCase, ready, startCase } = useDemoCase();

  function begin() {
    startCase();
    router.push("/deteccion");
  }

  function continueCase() {
    router.push("/ruta");
  }

  return (
    <AppShell>
      <AppHeader />
      <main className="flex flex-1 flex-col pt-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-teal-800">SIGUEMX</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink-900">
          Detección es solo el inicio.
        </h1>
        <p className="mt-4 text-lg leading-7 text-ink-700">
          Alguien se encarga del siguiente paso.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-4">
                <span className="text-teal-800">
                  <Icon />
                </span>
                <p className="mt-3 text-sm font-semibold text-ink-900">{item.title}</p>
              </Card>
            );
          })}
        </div>

        <p className="mt-6 rounded-[24px] border border-terracotta-600/20 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700">
          Este es un caso simulado. No es un diagnóstico.
        </p>

        <div className="mt-8 space-y-3">
          <PrimaryButton type="button" onClick={begin}>
            Comenzar caso de ejemplo
          </PrimaryButton>
          {ready && demoCase ? (
            <SecondaryButton type="button" onClick={continueCase}>
              Continuar caso simulado
            </SecondaryButton>
          ) : null}
        </div>

        <div className="mt-10">
          <PersonaNote />
        </div>
      </main>
    </AppShell>
  );
}
