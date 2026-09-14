"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDemoCase } from "./CaseProvider";

export function RequireCase({ children }: { children: React.ReactNode }) {
  const { demoCase, ready } = useDemoCase();
  const router = useRouter();

  useEffect(() => {
    if (ready && !demoCase) {
      router.replace("/");
    }
  }, [demoCase, ready, router]);

  if (!ready) {
    return <p className="py-20 text-center text-sm text-ink-500">Cargando caso simulado…</p>;
  }

  if (!demoCase) {
    return null;
  }

  return <>{children}</>;
}
