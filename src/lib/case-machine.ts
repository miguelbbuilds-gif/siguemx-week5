import type {
  CaseStatus,
  CheckInAnswers,
  DemoCase,
} from "./types.ts";
import { ATTENDED_OPTIONS, APPOINTMENT_OPTIONS, CONTACTED_OPTIONS } from "./types.ts";

const CONTACTED = new Set(CONTACTED_OPTIONS.map((o) => o.value));
const APPOINTMENT = new Set(APPOINTMENT_OPTIONS.map((o) => o.value));
const ATTENDED = new Set(ATTENDED_OPTIONS.map((o) => o.value));

export function createSimulatedCase(now = new Date()): DemoCase {
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
    deadlineISO: "2026-09-16",
    deadlineLabel: "16 de septiembre",
    affordability: "Opción de menor costo disponible",
    status: "action_needed",
    checkIn: {},
    appointmentBooked: false,
    patientReportedAttendance: false,
    coordinatorVerified: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export function touch(demoCase: DemoCase, now = new Date()): DemoCase {
  return { ...demoCase, updatedAt: now.toISOString() };
}

export type CheckInValidation =
  | { ok: true; answers: CheckInAnswers }
  | { ok: false; missing: string[]; message: string };

export function validateCheckIn(input: Partial<CheckInAnswers>): CheckInValidation {
  const missing: string[] = [];

  const contactedClinic = input.contactedClinic;
  const hasAppointment = input.hasAppointment;
  const attended = input.attended;

  if (!contactedClinic || !CONTACTED.has(contactedClinic)) {
    missing.push("contactedClinic");
  }
  if (!hasAppointment || !APPOINTMENT.has(hasAppointment)) {
    missing.push("hasAppointment");
  }
  if (!attended || !ATTENDED.has(attended)) {
    missing.push("attended");
  }

  if (missing.length > 0 || !contactedClinic || !hasAppointment || !attended) {
    return {
      ok: false,
      missing: missing.length ? missing : ["contactedClinic", "hasAppointment", "attended"],
      message: "Responde las tres preguntas para guardar el seguimiento.",
    };
  }

  return {
    ok: true,
    answers: {
      contactedClinic,
      hasAppointment,
      attended,
    },
  };
}

function nextStatusAfterCheckIn(
  demoCase: DemoCase,
  answers: CheckInAnswers,
): CaseStatus {
  if (answers.attended === "si") {
    return "verification_pending";
  }

  if (demoCase.status === "escalated") {
    return "escalated";
  }

  if (demoCase.status === "deadline_approaching") {
    return "deadline_approaching";
  }

  return "action_needed";
}

export function applyCheckIn(demoCase: DemoCase, answers: CheckInAnswers): DemoCase {
  const patientReportedAttendance = answers.attended === "si";
  const appointmentBooked =
    answers.hasAppointment === "si" ||
    patientReportedAttendance ||
    answers.attended === "reprograme" ||
    demoCase.appointmentBooked;

  return touch({
    ...demoCase,
    checkIn: answers,
    appointmentBooked,
    patientReportedAttendance,
    coordinatorVerified: false,
    status: nextStatusAfterCheckIn(demoCase, answers),
  });
}

export function reportAppointmentBooked(demoCase: DemoCase): DemoCase {
  if (demoCase.status === "verified" || demoCase.status === "verification_pending") {
    return demoCase;
  }

  return touch({
    ...demoCase,
    appointmentBooked: true,
    checkIn: { ...demoCase.checkIn, hasAppointment: "si" },
    status: demoCase.status === "escalated" ? "action_needed" : demoCase.status,
  });
}

export function markDeadlineApproaching(demoCase: DemoCase): DemoCase {
  if (demoCase.status === "verified" || demoCase.status === "verification_pending") {
    return demoCase;
  }

  return touch({
    ...demoCase,
    status: "deadline_approaching",
  });
}

export function escalateMissedDeadline(demoCase: DemoCase): DemoCase {
  if (demoCase.status === "verified") {
    return demoCase;
  }

  if (demoCase.status === "verification_pending") {
    return demoCase;
  }

  return touch({
    ...demoCase,
    status: "escalated",
  });
}

export function verifyByCoordinator(demoCase: DemoCase): DemoCase {
  if (demoCase.status !== "verification_pending") {
    return demoCase;
  }

  return touch({
    ...demoCase,
    coordinatorVerified: true,
    status: "verified",
  });
}

export function isHandoffClosed(demoCase: DemoCase): boolean {
  return demoCase.status === "verified" && demoCase.coordinatorVerified;
}

export function patientActionCanCloseCase(): false {
  return false;
}

export function progressIndex(status: CaseStatus): number {
  switch (status) {
    case "verified":
      return 3;
    case "verification_pending":
      return 2;
    case "action_needed":
    case "deadline_approaching":
    case "escalated":
    default:
      return 1;
  }
}
