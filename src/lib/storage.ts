import { STORAGE_KEY, type DemoCase } from "./types.ts";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeCase(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

export function getCaseSnapshot() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function getServerCaseSnapshot() {
  return null;
}

export function loadCase(): DemoCase | null {
  const raw = getCaseSnapshot();
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DemoCase;
    if (!parsed || parsed.simulated !== true || parsed.id !== "sim-laura-cdmx-001") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveCase(demoCase: DemoCase): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoCase));
  emit();
}

export function clearCase(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  emit();
}
