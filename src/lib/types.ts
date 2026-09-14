export const STORAGE_KEY = "siguemx-demo-case-v1";

export type CaseStatus =
  | "action_needed"
  | "deadline_approaching"
  | "escalated"
  | "verification_pending"
  | "verified";

export type WorkflowStep =
  | "landing"
  | "screening"
  | "care_route"
  | "explanation"
  | "follow_up"
  | "reminder"
  | "escalation"
  | "verification"
  | "help";

export type ContactedClinic = "si" | "no" | "necesito_ayuda";
export type HasAppointment = "si" | "no" | "necesito_ayuda";
export type AttendedAppointment = "si" | "no" | "reprograme";

export type CheckInAnswers = {
  contactedClinic: ContactedClinic;
  hasAppointment: HasAppointment;
  attended: AttendedAppointment;
};

export type DemoPersona = {
  id: "laura-sim";
  displayName: "Laura";
  age: 55;
  city: "Ciudad de México";
  occupation: "Trabajadora informal";
  fictional: true;
};

export type Coordinator = {
  name: "Ana Martínez";
  role: "Coordinadora de cuidado";
};

export type DemoCase = {
  id: string;
  simulated: true;
  notADiagnosis: true;
  persona: DemoPersona;
  coordinator: Coordinator;
  screeningResult: "Riesgo elevado de diabetes";
  nextAction: "Agendar una visita de confirmación";
  deadlineISO: string;
  deadlineLabel: string;
  affordability: "Opción de menor costo disponible";
  status: CaseStatus;
  currentStep: WorkflowStep;
  checkIn: Partial<CheckInAnswers>;
  appointmentBooked: boolean;
  patientReportedAttendance: boolean;
  coordinatorVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export const STATUS_LABEL: Record<CaseStatus, string> = {
  action_needed: "ACTION NEEDED",
  deadline_approaching: "ACTION NEEDED",
  escalated: "ESCALAMIENTO ACTIVADO",
  verification_pending: "VERIFICACIÓN PENDIENTE",
  verified: "PASO VERIFICADO",
};

export const STEP_PATH: Record<WorkflowStep, string> = {
  landing: "/",
  screening: "/deteccion",
  care_route: "/ruta",
  explanation: "/explicacion",
  follow_up: "/seguimiento",
  reminder: "/recordatorio",
  escalation: "/escalamiento",
  verification: "/verificacion",
  help: "/ayuda",
};

export const CONTACTED_OPTIONS: { value: ContactedClinic; label: string }[] = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "necesito_ayuda", label: "Necesito ayuda" },
];

export const APPOINTMENT_OPTIONS: { value: HasAppointment; label: string }[] = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "necesito_ayuda", label: "Necesito ayuda" },
];

export const ATTENDED_OPTIONS: { value: AttendedAppointment; label: string }[] = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "reprograme", label: "La reprogramé" },
];
