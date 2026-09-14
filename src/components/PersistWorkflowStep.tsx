"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { stepFromPath } from "@/lib/persist";
import { useDemoCase } from "./CaseProvider";

export function PersistWorkflowStep() {
  const pathname = usePathname();
  const { demoCase, ready, rememberStep } = useDemoCase();

  useEffect(() => {
    if (!ready || !demoCase) return;
    const step = stepFromPath(pathname);
    if (!step) return;
    rememberStep(step);
  }, [demoCase, pathname, ready, rememberStep]);

  return null;
}
