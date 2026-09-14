import { progressIndex } from "@/lib/case-machine";
import type { CaseStatus } from "@/lib/types";
import { CalendarIcon, HeartIcon, SearchIcon, ShieldIcon } from "./Icons";

const STEPS = [
  { id: "detection", label: "Detección", icon: SearchIcon },
  { id: "confirm", label: "Visita de confirmación", icon: CalendarIcon },
  { id: "followup", label: "Seguimiento", icon: HeartIcon },
  { id: "verified", label: "Entrega verificada", icon: ShieldIcon },
];

export function ProgressTrack({ status }: { status: CaseStatus }) {
  const current = progressIndex(status);

  return (
    <ol className="grid grid-cols-4 gap-2 text-center">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const complete = index < current || status === "verified";
        const active = index === current && status !== "verified";
        return (
          <li key={step.id} className="flex flex-col items-center gap-2">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                complete || active ? "text-teal-800" : "text-teal-800/35"
              }`}
            >
              <Icon />
            </span>
            <span className="max-w-[78px] text-[11px] font-medium leading-4 text-ink-700">
              {step.label}
            </span>
            <span
              className={`h-2 w-2 rounded-full ${
                complete || active ? "bg-teal-800" : "border border-teal-800/30 bg-transparent"
              }`}
              aria-hidden
            />
          </li>
        );
      })}
    </ol>
  );
}
