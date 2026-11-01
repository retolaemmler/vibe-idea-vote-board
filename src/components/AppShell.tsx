import type { ReactNode } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { Logo } from "@/design-system/raiffeisen-design-system-7de3c4";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page text-default font-brand">
      <header className="border-b border-default">
        <div className="container flex flex-wrap items-center justify-between gap-s40 py-s40">
          <RouterLink to="/" className="flex items-center gap-s30">
            <Logo decorative />
            <span className="text-navigation-bold">Ideen-Board · Vibe Code PoC</span>
          </RouterLink>
          <nav className="flex gap-s50 text-navigation" aria-label="Hauptnavigation">
            <RouterLink to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-navigation-bold" }}>Dashboard</RouterLink>
            <RouterLink to="/ideen" activeOptions={{ exact: true }} activeProps={{ className: "text-navigation-bold" }}>Alle Ideen</RouterLink>
            <RouterLink to="/ideen/neu" activeProps={{ className: "text-navigation-bold" }}>Idee erfassen</RouterLink>
          </nav>
        </div>
      </header>
      <main className="container py-d80">{children}</main>
    </div>
  );
}
