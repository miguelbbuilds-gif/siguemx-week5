import type { DemoCase } from "./types.ts";

export type ExplanationPayload = {
  screeningResult: string;
  nextAction: string;
  coordinatorName: string;
  deadlineLabel: string;
  personaName: string;
};

export type ExplanationResult = {
  text: string;
  source: "simulated" | "llm";
  labels: string[];
};

export function toExplanationPayload(demoCase: DemoCase): ExplanationPayload {
  return {
    screeningResult: demoCase.screeningResult,
    nextAction: demoCase.nextAction,
    coordinatorName: demoCase.coordinator.name.split(" ")[0],
    deadlineLabel: demoCase.deadlineLabel,
    personaName: demoCase.persona.displayName,
  };
}

export function buildSimulatedExplanation(payload: ExplanationPayload): ExplanationResult {
  const text = [
    `Tu resultado de detección sugiere un ${payload.screeningResult.toLowerCase()}. Esto no es un diagnóstico.`,
    `Tu siguiente paso es ${payload.nextAction.toLowerCase()} dentro de los próximos 3 días (antes del ${payload.deadlineLabel}).`,
    `${payload.coordinatorName}, tu coordinadora de cuidado, te ayudará a completar este paso.`,
  ].join("\n\n");

  return {
    text,
    source: "simulated",
    labels: ["Generado por IA con datos simulados.", "No es consejo médico."],
  };
}

export function isValidExplanationPayload(value: unknown): value is ExplanationPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const keys: (keyof ExplanationPayload)[] = [
    "screeningResult",
    "nextAction",
    "coordinatorName",
    "deadlineLabel",
    "personaName",
  ];
  return keys.every((key) => typeof v[key] === "string" && String(v[key]).length > 0 && String(v[key]).length < 200);
}
