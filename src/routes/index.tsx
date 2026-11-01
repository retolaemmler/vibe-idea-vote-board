import { createFileRoute } from "@tanstack/react-router";
import {
  Button, ButtonSet, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/design-system/raiffeisen-design-system-7de3c4";
import { AppShell } from "@/components/AppShell";
import { IdeaCard } from "@/components/IdeaCard";
import { useIdeas } from "@/hooks/use-ideas";
import { CATEGORIES } from "@/lib/ideas";

export const Route = createFileRoute("/")({
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
  const { ideas, likedIds } = useIdeas();
  const list = ideas.data ?? [];
  const top = list.filter((i) => i.like_count > 0).slice(0, 5);
  const totalLikes = list.reduce((s, i) => s + i.like_count, 0);

  return (
    <AppShell>
      <section className="flex flex-col gap-d40 pb-d80">
        <h1 className="text-hero200">Unsere besten Ideen</h1>
        <p className="text-large max-w-3xl">
          Erfassen Sie Ihre Idee aus dem Vibe Code PoC Workshop und liken Sie die Vorschläge Ihrer Kolleginnen und Kollegen.
        </p>
        <ButtonSet>
          <Button href="/ideen/neu">Idee erfassen</Button>
          <Button variant="link" href="/ideen">Alle Ideen ansehen</Button>
        </ButtonSet>
      </section>

      <div className="grid gap-s50 pb-d80 sm:grid-cols-3">
        <Stat label="Ideen" value={list.length} />
        <Stat label="Likes" value={totalLikes} />
        <Stat label="Kategorien genutzt" value={new Set(list.map((i) => i.category)).size} />
      </div>

      <div className="grid gap-d80 lg:grid-cols-3">
        <section className="flex flex-col gap-s50 lg:col-span-2" aria-busy={ideas.isLoading}>
          <h2 className="text-t200">Top 5 Ideen</h2>
          {ideas.isLoading ? (
            <Skeleton variant="box" />
          ) : top.length === 0 ? (
            <p className="text-standard text-subtle">Noch keine Likes – seien Sie die erste Person, die eine Idee bewertet.</p>
          ) : (
            top.map((idea, i) => <IdeaCard key={idea.id} idea={idea} rank={i + 1} liked={likedIds.has(idea.id)} />)
          )}
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
