import { useState, type ReactNode } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { IconButton, Logo } from "@/design-system/raiffeisen-design-system-7de3c4";

const NAV = [
  { to: "/", label: "Dashboard", exact: true },
  { to: "/ideen", label: "Alle Ideen", exact: true },
  { to: "/ideen/neu", label: "Idee erfassen", exact: false },
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
    <div className="min-h-screen bg-page text-default font-brand">
      <header className="border-b border-default">
        <div className="container flex items-center justify-between gap-s40 py-s40">
          <RouterLink to="/" aria-label="Ideen-Board Startseite">
            <Logo decorative />
          </RouterLink>
          <nav className="hidden gap-s50 text-navigation md:flex" aria-label="Hauptnavigation">
            {links}
          </nav>
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
          </nav>
        )}
      </header>
      <main className="container py-d80">{children}</main>
    </div>
  );
}
