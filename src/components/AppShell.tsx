import { useState, type ReactNode } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { Button, IconButton, Link, Logo } from "@/design-system/raiffeisen-design-system-7de3c4";

const NAV = [
  { to: "/", label: "Dashboard", exact: true },
  { to: "/ideen", label: "Alle Ideen", exact: true },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const links = NAV.map((n) => (
    <RouterLink
      key={n.to}
      to={n.to}
      activeOptions={{ exact: n.exact }}
      activeProps={{ className: "text-navigation-bold" }}
      onClick={() => setOpen(false)}
    >
      {n.label}
    </RouterLink>
  ));

  return (
    <div className="flex min-h-screen flex-col bg-page text-default font-brand">
      <header className="bg-page">
        <div className="container flex items-center justify-between gap-s40 py-s50">
          <RouterLink to="/" aria-label="Ideen-Board Startseite">
            <Logo decorative />
          </RouterLink>
          <div className="hidden items-center gap-s70 md:flex">
            <nav className="flex gap-s50 text-navigation" aria-label="Hauptnavigation">
              {links}
            </nav>
            <Button href="/ideen/neu">Idee erfassen</Button>
          </div>
          <div className="md:hidden">
            {open ? (
              <IconButton icon="close" label="Menü schliessen" aria-expanded onClick={() => setOpen(false)} />
            ) : (
              <button
                type="button"
                aria-label="Menü öffnen"
                aria-expanded={false}
                aria-controls="mobile-nav"
                onClick={() => setOpen(true)}
                className="flex items-center justify-center p-s20"
              >
                <span className="pi pi-bars text-t400" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        {open && (
          <nav
            id="mobile-nav"
            className="container flex flex-col gap-s40 border-t border-default py-s50 text-navigation md:hidden"
            aria-label="Hauptnavigation"
          >
            {links}
            <Button href="/ideen/neu" onClick={() => setOpen(false)}>Idee erfassen</Button>
          </nav>
        )}
      </header>
      <main className="container flex-1 py-d80">{children}</main>
      <footer className="inverted bg-inverse text-inverse">
        <div className="container flex flex-col gap-d60 py-d80">
          <Logo />
          <nav className="flex flex-wrap gap-s50 text-standard" aria-label="Fussnavigation">
            <Link href="/">Dashboard</Link>
            <Link href="/ideen">Alle Ideen</Link>
            <Link href="/ideen/neu">Idee erfassen</Link>
            <Link href="https://www.raiffeisen.ch" external>raiffeisen.ch</Link>
          </nav>
          <div className="flex flex-col gap-s20 border-t border-inverse pt-s50 text-small sm:flex-row sm:justify-between">
            <span>Ideen-Board · Vibe Code PoC Workshop</span>
            <span>© {new Date().getFullYear()} Raiffeisen Schweiz</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
