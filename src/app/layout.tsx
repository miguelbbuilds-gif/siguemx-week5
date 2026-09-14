import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CaseProvider } from "@/components/CaseProvider";
import { PersistWorkflowStep } from "@/components/PersistWorkflowStep";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SigueMX — Detección es solo el inicio",
  description:
    "Prototipo simulado: alguien se encarga del siguiente paso después de una detección.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <CaseProvider>
          <PersistWorkflowStep />
          {children}
        </CaseProvider>
      </body>
    </html>
  );
}
