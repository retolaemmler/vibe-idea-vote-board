import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, ButtonSet, Input } from "@/design-system/raiffeisen-design-system-7de3c4";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, getStoredName, ideaSchema, setStoredName } from "@/lib/ideas";

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

type Errors = Partial<Record<"author_name" | "title" | "description" | "category", string>>;

function NewIdea() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  useEffect(() => setName(getStoredName()), []);

  const create = useMutation({
    mutationFn: async (values: ReturnType<typeof ideaSchema.parse>) => {
      const { error } = await supabase.from("ideas").insert(values);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ideas"] });
      navigate({ to: "/ideen", search: { sort: "neu" } });
    },
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = ideaSchema.safeParse({ author_name: name, title, description, category });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof Errors] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStoredName(parsed.data.author_name);
    create.mutate(parsed.data);
  }

  return (
    <AppShell>
      <form onSubmit={submit} className="flex max-w-2xl flex-col gap-d60" noValidate>
        <h1 className="text-t100">Idee erfassen</h1>
        <Input label="Ihr Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80}
          autoComplete="name" error={errors.author_name} />
        <Input label="Titel" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120}
          showCharacterCount error={errors.title} />
        <label className="flex flex-col gap-s20 text-small">
          Beschreibung
          <textarea
            className="min-h-40 border border-input bg-page p-s30 text-standard"
            value={description}
            maxLength={2000}
            onChange={(e) => setDescription(e.target.value)}
            aria-invalid={!!errors.description}
          />
          {errors.description && <span className="text-danger">{errors.description}</span>}
        </label>
        <label className="flex flex-col gap-s20 text-small">
          Kategorie
          <select
            className="border-b border-input bg-page py-s20 text-standard-bold"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-invalid={!!errors.category}
          >
            <option value="">Bitte wählen</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <span className="text-danger">{errors.category}</span>}
        </label>
        {create.isError && (
          <Alert variant="danger" title="Speichern fehlgeschlagen">Bitte versuchen Sie es erneut.</Alert>
        )}
        <ButtonSet>
          <Button type="submit" isLoading={create.isPending}>Idee speichern</Button>
          <Button variant="link" href="/ideen">Abbrechen</Button>
        </ButtonSet>
      </form>
    </AppShell>
  );
}
