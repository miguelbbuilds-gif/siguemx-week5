"use client";

import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "./Icons";

export function SimulatedBanner() {
  return (
    <div className="rounded-full border border-teal-800/15 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-teal-800">
      SIMULADO
    </div>
  );
}

export function AppHeader({ showReset }: { showReset?: boolean }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header className="flex items-center justify-between gap-3">
      <Link href="/" aria-label="SigueMX inicio">
        <BrandMark />
      </Link>
      {showReset && !isLanding ? (
        <Link href="/" className="text-sm font-medium text-teal-800 underline-offset-4 hover:underline">
          Reiniciar demo
        </Link>
      ) : (
        <span className="sr-only">Caso simulado</span>
      )}
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5 py-6 sm:max-w-xl sm:px-8 sm:py-10">
      {children}
    </div>
  );
}

export function PersonaNote() {
  return (
    <p className="text-center text-xs leading-5 text-ink-500">
      Persona de demostración: Laura, 55 años, trabajadora informal en la Ciudad de México.
      Toda la información es ficticia.
    </p>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(28,42,42,0.06)] ${className}`}>
      {children}
    </section>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`flex h-14 w-full items-center justify-center rounded-full bg-teal-800 px-5 text-base font-semibold text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-full border border-teal-800/20 bg-white px-5 text-base font-semibold text-teal-800 transition hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "action" | "warn" | "pending" | "done";
}) {
  const styles = {
    action: "bg-terracotta-50 text-terracotta-700",
    warn: "bg-red-50 text-red-800",
    pending: "bg-amber-50 text-amber-800",
    done: "bg-teal-50 text-teal-800",
  }[tone];

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.08em] ${styles}`}>
      {label}
    </span>
  );
}
