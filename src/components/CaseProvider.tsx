"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  applyCheckIn,
  createSimulatedCase,
  escalateMissedDeadline,
  markDeadlineApproaching,
  reportAppointmentBooked,
  validateCheckIn,
  verifyByCoordinator,
} from "@/lib/case-machine";
import { parseDemoCase } from "@/lib/persist";
import {
  clearCase,
  getClientCaseSnapshot,
  getServerCaseSnapshot,
  loadCase,
  saveCase,
  subscribeCase,
} from "@/lib/storage";
import type { CheckInAnswers, DemoCase, WorkflowStep } from "@/lib/types";

type CaseContextValue = {
  demoCase: DemoCase | null;
  ready: boolean;
  startCase: () => DemoCase;
  resetCase: () => void;
  rememberStep: (step: WorkflowStep) => void;
  saveCheckIn: (answers: Partial<CheckInAnswers>) => { ok: true } | { ok: false; message: string; missing: string[] };
  markAppointment: () => void;
  simulateDeadlineApproaching: () => void;
  simulateMissedDeadline: () => void;
  simulateCoordinatorVerification: () => { ok: true } | { ok: false; message: string };
};

const CaseContext = createContext<CaseContextValue | null>(null);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeCase, getClientCaseSnapshot, getServerCaseSnapshot);
  const ready = snapshot !== null;
  const demoCase = useMemo(() => (ready ? parseDemoCase(snapshot) : null), [ready, snapshot]);

  const startCase = useCallback(() => {
    const next = createSimulatedCase();
    saveCase(next);
    return next;
  }, []);

  const resetCase = useCallback(() => {
    clearCase();
  }, []);

  const rememberStep = useCallback((step: WorkflowStep) => {
    if (step === "landing") return;
    const current = loadCase();
    if (!current || current.currentStep === step) return;
    saveCase({ ...current, currentStep: step, updatedAt: new Date().toISOString() });
  }, []);

  const saveCheckIn = useCallback((answers: Partial<CheckInAnswers>) => {
    const validation = validateCheckIn(answers);
    if (!validation.ok) {
      return validation;
    }

    const base = loadCase() ?? createSimulatedCase();
    saveCase(applyCheckIn(base, validation.answers));
    return { ok: true as const };
  }, []);

  const markAppointment = useCallback(() => {
    const current = loadCase();
    if (!current) return;
    saveCase(reportAppointmentBooked(current));
  }, []);

  const simulateDeadlineApproaching = useCallback(() => {
    const current = loadCase();
    if (!current) return;
    saveCase(markDeadlineApproaching(current));
  }, []);

  const simulateMissedDeadline = useCallback(() => {
    const current = loadCase();
    if (!current) return;
    saveCase(escalateMissedDeadline(current));
  }, []);

  const simulateCoordinatorVerification = useCallback(() => {
    const current = loadCase();
    if (!current || current.status !== "verification_pending") {
      return {
        ok: false as const,
        message: "Solo se puede verificar cuando el estado es VERIFICACIÓN PENDIENTE.",
      };
    }

    saveCase(verifyByCoordinator(current));
    return { ok: true as const };
  }, []);

  const value = useMemo(
    () => ({
      demoCase,
      ready,
      startCase,
      resetCase,
      rememberStep,
      saveCheckIn,
      markAppointment,
      simulateDeadlineApproaching,
      simulateMissedDeadline,
      simulateCoordinatorVerification,
    }),
    [
      demoCase,
      ready,
      startCase,
      resetCase,
      rememberStep,
      saveCheckIn,
      markAppointment,
      simulateDeadlineApproaching,
      simulateMissedDeadline,
      simulateCoordinatorVerification,
    ],
  );

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}

export function useDemoCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) {
    throw new Error("useDemoCase must be used within CaseProvider");
  }
  return ctx;
}
