import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Button, Skeleton } from "@/design-system/raiffeisen-design-system-7de3c4";
import { AppShell } from "@/components/AppShell";
import { IdeaCard } from "@/components/IdeaCard";
import { useIdeas } from "@/hooks/use-ideas";
import { CATEGORIES } from "@/lib/ideas";

const search = z.object({ kategorie: z.string().optional(), sort: z.enum(["likes", "neu"]).optional() });

export const Route = createFileRoute("/ideen/")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Alle Ideen – Ideen-Board Vibe Code PoC" },
      { name: "description", content: "Alle Ideen aus dem Workshop durchsuchen, filtern und liken." },
      { property: "og:title", content: "Alle Ideen – Ideen-Board Vibe Code PoC" },
      { property: "og:description", content: "Alle Ideen aus dem Workshop durchsuchen, filtern und liken." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AllIdeas,
});

function AllIdeas() {
  const { kategorie, sort = "likes" } = Route.useSearch();
  const navigate = useNavigate({ from: "/ideen/" });
  const { ideas, likedIds } = useIdeas();
  let list = (ideas.data ?? []).filter((i) => !kategorie || i.category === kategorie);
  if (sort === "neu") list = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-s50 pb-d60">
        <h1 className="text-t100">Alle Ideen</h1>
        <Button href="/ideen/neu">Idee erfassen</Button>
      </div>
      <div className="flex flex-wrap gap-s50 pb-d60">
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
            onChange={(e) => navigate({ search: (p) => ({ ...p, sort: e.target.value as "likes" | "neu" }) })}
          >
            <option value="likes">Meiste Likes</option>
            <option value="neu">Neueste</option>
          </select>
        </label>
      </div>
      <section className="grid gap-s50 md:grid-cols-2" aria-busy={ideas.isLoading}>
        {ideas.isLoading ? (
          <Skeleton variant="box" />
        ) : list.length === 0 ? (
          <p className="text-standard text-subtle">Noch keine Ideen in dieser Auswahl.</p>
        ) : (
          list.map((idea) => <IdeaCard key={idea.id} idea={idea} liked={likedIds.has(idea.id)} />)
        )}
      </section>
    </AppShell>
  );
}
