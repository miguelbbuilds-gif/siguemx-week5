import { STORAGE_KEY, type DemoCase } from "./types.ts";
import { parseDemoCase, serializeDemoCase } from "./persist.ts";

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

export function getClientCaseSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function getServerCaseSnapshot(): null {
  return null;
}

export function loadCase(): DemoCase | null {
  if (typeof window === "undefined") return null;
  return parseDemoCase(getClientCaseSnapshot());
}

export function saveCase(demoCase: DemoCase): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeDemoCase(demoCase));
    emit();
  } catch {
    // Private mode or blocked storage should not crash the demo.
  }
}

export function clearCase(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
  emit();
}
