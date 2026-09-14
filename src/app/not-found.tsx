import Link from "next/link";
import { AppShell } from "@/components/Ui";
import { BrandMark } from "@/components/Icons";

export default function NotFound() {
  return (
    <AppShell>
      <BrandMark />
      <h1 className="mt-8 text-2xl font-semibold">Página no encontrada</h1>
      <p className="mt-2 text-sm text-ink-700">Vuelve al caso simulado de SigueMX.</p>
      <Link href="/" className="mt-6 inline-flex font-semibold text-teal-800">
        Ir al inicio
      </Link>
    </AppShell>
  );
}
