import type { CaseStatus, CheckInAnswers, DemoCase, WorkflowStep } from "./types.ts";
import { STEP_PATH } from "./types.ts";

const STATUSES = new Set<CaseStatus>([
  "action_needed",
  "deadline_approaching",
  "escalated",
  "verification_pending",
  "verified",
]);

const STEPS = new Set<WorkflowStep>([
  "landing",
  "screening",
  "care_route",
  "explanation",
  "follow_up",
  "reminder",
  "escalation",
  "verification",
  "help",
]);

const PATH_TO_STEP = new Map<string, WorkflowStep>(
  Object.entries(STEP_PATH).map(([step, path]) => [path, step as WorkflowStep]),
);

export function stepFromPath(pathname: string): WorkflowStep | null {
  return PATH_TO_STEP.get(pathname) ?? null;
}

export function pathFromStep(step: WorkflowStep): string {
  return STEP_PATH[step];
}

export function inferStepFromStatus(status: CaseStatus): WorkflowStep {
  switch (status) {
    case "verified":
    case "verification_pending":
      return "verification";
    case "escalated":
      return "escalation";
    case "deadline_approaching":
      return "reminder";
    default:
      return "care_route";
  }
}

export function resumePath(demoCase: DemoCase): string {
  const step = demoCase.currentStep === "landing" ? inferStepFromStatus(demoCase.status) : demoCase.currentStep;
  return pathFromStep(step);
}

export function shouldRedirectToLanding(ready: boolean, demoCase: DemoCase | null): boolean {
  return ready && demoCase === null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 && value.length < 200 ? value : fallback;
}

function parseCheckIn(value: unknown): Partial<CheckInAnswers> {
  if (!isRecord(value)) return {};

  const checkIn: Partial<CheckInAnswers> = {};
  if (value.contactedClinic === "si" || value.contactedClinic === "no" || value.contactedClinic === "necesito_ayuda") {
    checkIn.contactedClinic = value.contactedClinic;
  }
  if (value.hasAppointment === "si" || value.hasAppointment === "no" || value.hasAppointment === "necesito_ayuda") {
    checkIn.hasAppointment = value.hasAppointment;
  }
  if (value.attended === "si" || value.attended === "no" || value.attended === "reprograme") {
    checkIn.attended = value.attended;
  }
  return checkIn;
}

export function parseDemoCase(raw: string | null | undefined): DemoCase | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(parsed)) return null;
  if (parsed.simulated !== true) return null;
  if (parsed.notADiagnosis !== true && parsed.notADiagnosis !== undefined) return null;

  const status = typeof parsed.status === "string" && STATUSES.has(parsed.status as CaseStatus)
    ? (parsed.status as CaseStatus)
    : null;
  if (!status) return null;

  const currentStep =
    typeof parsed.currentStep === "string" && STEPS.has(parsed.currentStep as WorkflowStep)
      ? (parsed.currentStep as WorkflowStep)
      : inferStepFromStatus(status);

  const checkIn = parseCheckIn(parsed.checkIn);
  const patientReportedAttendance =
    asBoolean(parsed.patientReportedAttendance) || checkIn.attended === "si";
  const coordinatorVerified = status === "verified" ? true : asBoolean(parsed.coordinatorVerified);

  return {
    id: "sim-laura-cdmx-001",
    simulated: true,
    notADiagnosis: true,
    persona: {
      id: "laura-sim",
      displayName: "Laura",
      age: 55,
      city: "Ciudad de México",
      occupation: "Trabajadora informal",
      fictional: true,
    },
    coordinator: {
      name: "Ana Martínez",
      role: "Coordinadora de cuidado",
    },
    screeningResult: "Riesgo elevado de diabetes",
    nextAction: "Agendar una visita de confirmación",
    deadlineISO: asString(parsed.deadlineISO, "2026-09-16"),
    deadlineLabel: asString(parsed.deadlineLabel, "16 de septiembre"),
    affordability: "Opción de menor costo disponible",
    status,
    currentStep,
    checkIn,
    appointmentBooked: asBoolean(parsed.appointmentBooked) || checkIn.hasAppointment === "si",
    patientReportedAttendance,
    coordinatorVerified,
    createdAt: asString(parsed.createdAt, new Date(0).toISOString()),
    updatedAt: asString(parsed.updatedAt, new Date(0).toISOString()),
  };
}

export function serializeDemoCase(demoCase: DemoCase): string {
  return JSON.stringify({
    id: demoCase.id,
    simulated: true,
    notADiagnosis: true,
    persona: demoCase.persona,
    coordinator: demoCase.coordinator,
    screeningResult: demoCase.screeningResult,
    nextAction: demoCase.nextAction,
    deadlineISO: demoCase.deadlineISO,
    deadlineLabel: demoCase.deadlineLabel,
    affordability: demoCase.affordability,
    status: demoCase.status,
    currentStep: demoCase.currentStep,
    checkIn: demoCase.checkIn,
    appointmentBooked: demoCase.appointmentBooked,
    patientReportedAttendance: demoCase.patientReportedAttendance,
    coordinatorVerified: demoCase.coordinatorVerified,
    createdAt: demoCase.createdAt,
    updatedAt: demoCase.updatedAt,
  });
}
