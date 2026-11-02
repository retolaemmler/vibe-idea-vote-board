import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { IdeaForm } from "@/components/IdeaForm";
import { supabase } from "@/integrations/supabase/client";
import { setStoredName, type IdeaInput } from "@/lib/ideas";

export const Route = createFileRoute("/ideen/neu")({
  head: () => ({
    meta: [
      { title: "Idee erfassen – Ideen-Board Vibe Code PoC" },
      { name: "description", content: "Erfassen Sie Ihre Idee mit Titel, Beschreibung und Kategorie." },
      { property: "og:title", content: "Idee erfassen – Ideen-Board Vibe Code PoC" },
      { property: "og:description", content: "Erfassen Sie Ihre Idee mit Titel, Beschreibung und Kategorie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewIdea,
});

function NewIdea() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: async (values: IdeaInput) => {
      setStoredName(values.author_name);
      const { error } = await supabase.from("ideas").insert(values);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ideas"] });
      navigate({ to: "/", search: { sort: "neu" } });
    },
  });

  return (
    <AppShell>
      <IdeaForm heading="Idee erfassen" submitLabel="Idee speichern"
        isPending={create.isPending} isError={create.isError} onSubmit={(v) => create.mutate(v)} />
    </AppShell>
  );
}
