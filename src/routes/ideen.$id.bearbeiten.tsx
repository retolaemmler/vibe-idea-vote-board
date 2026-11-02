import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, ButtonSet, Skeleton } from "@/design-system/raiffeisen-design-system-7de3c4";
import { AppShell } from "@/components/AppShell";
import { IdeaForm } from "@/components/IdeaForm";
import { supabase } from "@/integrations/supabase/client";
import { ideasQuery, type IdeaInput } from "@/lib/ideas";

export const Route = createFileRoute("/ideen/$id/bearbeiten")({
  head: () => ({
    meta: [
      { title: "Idee bearbeiten – Ideen-Board Vibe Code PoC" },
      { name: "description", content: "Titel, Beschreibung und Kategorie einer Idee anpassen oder die Idee löschen." },
      { property: "og:title", content: "Idee bearbeiten – Ideen-Board Vibe Code PoC" },
      { property: "og:description", content: "Titel, Beschreibung und Kategorie einer Idee anpassen oder die Idee löschen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditIdea,
});

function EditIdea() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const ideas = useQuery(ideasQuery);
  const idea = ideas.data?.find((i) => i.id === id);
  const [confirming, setConfirming] = useState(false);
  const done = () => {
    qc.invalidateQueries({ queryKey: ["ideas"] });
    navigate({ to: "/" });
  };

  const save = useMutation({
    mutationFn: async (values: IdeaInput) => {
      const { error } = await supabase.from("ideas").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: done,
  });
  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("ideas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: done,
  });

  return (
    <AppShell>
      {ideas.isLoading ? (
        <div aria-busy="true"><Skeleton variant="box" /></div>
      ) : !idea ? (
        <div className="flex flex-col gap-s50">
          <h1 className="text-t100">Idee nicht gefunden</h1>
          <p className="text-standard">Diese Idee wurde vielleicht bereits gelöscht.</p>
          <ButtonSet><Button variant="link" href="/">Zum Dashboard</Button></ButtonSet>
        </div>
      ) : (
        <IdeaForm
          heading="Idee bearbeiten"
          submitLabel="Änderungen speichern"
          initial={{ author_name: idea.author_name, title: idea.title, description: idea.description, category: idea.category as IdeaInput["category"] }}
          isPending={save.isPending}
          isError={save.isError}
          onSubmit={(v) => save.mutate(v)}
          extra={
            <section className="flex flex-col gap-s40 border-t border-default pt-d60">
              <h2 className="text-t400">Idee löschen</h2>
              {confirming ? (
                <>
                  <p className="text-standard">Die Idee und alle Likes werden endgültig gelöscht.</p>
                  <ButtonSet>
                    <Button type="button" variant="secondary" isLoading={remove.isPending} onClick={() => remove.mutate()}>Endgültig löschen</Button>
                    <Button type="button" variant="secondary" onClick={() => setConfirming(false)}>Behalten</Button>
                  </ButtonSet>
                </>
              ) : (
                <ButtonSet>
                  <Button type="button" variant="link" onClick={() => setConfirming(true)}>Idee löschen</Button>
                </ButtonSet>
              )}
              {remove.isError && <Alert variant="danger" title="Löschen fehlgeschlagen">Bitte versuchen Sie es erneut.</Alert>}
            </section>
          }
        />
      )}
    </AppShell>
  );
}
