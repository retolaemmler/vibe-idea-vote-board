import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Alert, Button, ButtonSet, Input } from "@/design-system/raiffeisen-design-system-7de3c4";
import { CATEGORIES, getStoredName, ideaSchema, type IdeaInput } from "@/lib/ideas";

type Errors = Partial<Record<keyof IdeaInput, string>>;

export function IdeaForm({
  heading, initial, submitLabel, isPending, isError, onSubmit, extra,
}: {
  heading: string;
  initial?: IdeaInput;
  submitLabel: string;
  isPending: boolean;
  isError: boolean;
  onSubmit: (values: IdeaInput) => void;
  extra?: ReactNode;
}) {
  const [name, setName] = useState(initial?.author_name ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [errors, setErrors] = useState<Errors>({});
  useEffect(() => {
    if (!initial) setName(getStoredName());
  }, [initial]);

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
    onSubmit(parsed.data);
  }

  return (
    <form onSubmit={submit} className="flex max-w-2xl flex-col gap-d60" noValidate>
      <h1 className="text-t100">{heading}</h1>
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
      {isError && (
        <Alert variant="danger" title="Speichern fehlgeschlagen">Bitte versuchen Sie es erneut.</Alert>
      )}
      <ButtonSet>
        <Button type="submit" isLoading={isPending}>{submitLabel}</Button>
        <Button variant="link" href="/">Abbrechen</Button>
      </ButtonSet>
      {extra}
    </form>
  );
}
