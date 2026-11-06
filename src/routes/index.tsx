import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Button, ButtonSet, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/design-system/raiffeisen-design-system-7de3c4";
import { AppShell } from "@/components/AppShell";
import { IdeaCard } from "@/components/IdeaCard";
import { useIdeas } from "@/hooks/use-ideas";
import { CATEGORIES } from "@/lib/ideas";

const search = z.object({ kategorie: z.string().optional(), sort: z.enum(["zufall", "likes", "neu"]).optional() });

// Stable pseudo-random rank per idea for one page load (survives live refreshes).
function rank(id: string, seed: number) {
  let h = seed;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 2654435761);
  return h >>> 0;
}

export const Route = createFileRoute("/")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Dashboard – Ideen-Board Vibe Code PoC" },
      { name: "description", content: "Die beliebtesten Ideen aus dem Vibe Code PoC Workshop auf einen Blick." },
      { property: "og:title", content: "Dashboard – Ideen-Board Vibe Code PoC" },
      { property: "og:description", content: "Die beliebtesten Ideen aus dem Vibe Code PoC Workshop auf einen Blick." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { kategorie, sort = "zufall" } = Route.useSearch();
  const [seed, setSeed] = useState(0);
  useEffect(() => setSeed(Math.floor(Math.random() * 2 ** 31)), []);
  const navigate = useNavigate({ from: "/" });
  const { ideas, likedIds } = useIdeas();
  const list = ideas.data ?? [];
  let all = list.filter((i) => !kategorie || i.category === kategorie);
  if (sort === "neu") all = [...all].sort((a, b) => b.created_at.localeCompare(a.created_at));
  else if (sort === "zufall") all = [...all].sort((a, b) => rank(a.id, seed) - rank(b.id, seed));
  const totalLikes = list.reduce((s, i) => s + i.like_count, 0);

  return (
    <AppShell>
      <section className="flex flex-col gap-d40 pb-d80">
        <h1 className="text-hero200">Vibe Code App Ideen</h1>
        <p className="text-large max-w-3xl">
          Erfassen Sie Ihre Idee für den PoC für den Vibe Code Workshop und liken Sie die Vorschläge Ihrer Kolleginnen und Kollegen.
        </p>
        <ButtonSet>
          <Button href="/ideen/neu">Idee erfassen</Button>
        </ButtonSet>
      </section>

      <div className="grid gap-s50 pb-d80 sm:grid-cols-3">
        <Stat label="Ideen" value={list.length} />
        <Stat label="Likes" value={totalLikes} />
        <Stat label="Kategorien genutzt" value={new Set(list.map((i) => i.category)).size} />
      </div>

      <div className="grid gap-d80 lg:grid-cols-3">
        <section className="flex flex-col gap-s50 lg:col-span-2" aria-busy={ideas.isLoading}>
          <h2 className="text-t200">Alle Ideen</h2>
          <div className="flex flex-wrap gap-s50">
            <label className="flex flex-col gap-s10 text-small">
              Kategorie
              <select
                className="border-b border-input bg-page py-s20 text-standard-bold"
                value={kategorie ?? ""}
                onChange={(e) => navigate({ search: (p) => ({ ...p, kategorie: e.target.value || undefined }) })}
              >
                <option value="">Alle Kategorien</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-s10 text-small">
              Sortierung
              <select
                className="border-b border-input bg-page py-s20 text-standard-bold"
                value={sort}
                onChange={(e) => navigate({ search: (p) => ({ ...p, sort: e.target.value as "zufall" | "likes" | "neu" }) })}
              >
                <option value="zufall">Zufällig</option>
                <option value="likes">Meiste Likes</option>
                <option value="neu">Neueste</option>
              </select>
            </label>
          </div>
          <div className="flex flex-col gap-s50">
            {ideas.isLoading ? (
              <Skeleton variant="box" />
            ) : all.length === 0 ? (
              <p className="text-standard text-subtle">Noch keine Ideen in dieser Auswahl.</p>
            ) : (
              all.map((idea) => <IdeaCard key={idea.id} idea={idea} liked={likedIds.has(idea.id)} />)
            )}
          </div>
        </section>
        <section className="flex flex-col gap-s50">
          <h2 className="text-t200">Nach Kategorie</h2>
          <Table label="Ideen pro Kategorie">
            <TableHeader>
              <TableRow>
                <TableHead>Kategorie</TableHead>
                <TableHead className="text-right">Ideen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CATEGORIES.map((c) => (
                <TableRow key={c}>
                  <TableCell>{c}</TableCell>
                  <TableCell className="text-right">{list.filter((i) => i.category === c).length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-s10 bg-subtle p-s50">
      <span className="text-small text-subtle">{label}</span>
      <span className="text-n100">{value}</span>
    </div>
  );
}
