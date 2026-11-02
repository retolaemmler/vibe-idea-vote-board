import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/design-system/raiffeisen-design-system-7de3c4";
import { supabase } from "@/integrations/supabase/client";
import { getVoterId, type Idea } from "@/lib/ideas";

export function IdeaCard({ idea, liked, rank }: { idea: Idea; liked: boolean; rank?: number }) {
  const qc = useQueryClient();
  const toggle = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("toggle_like", { _idea_id: idea.id, _voter_id: getVoterId() });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ideas"] });
      qc.invalidateQueries({ queryKey: ["my-likes"] });
    },
  });

  return (
    <article className="flex flex-col gap-s30 border border-default p-s50">
      <div className="flex items-start justify-between gap-s40">
        <div className="flex flex-col gap-s10">
          <span className="text-small text-subtle">
            {rank ? `#${rank} · ` : ""}
            {idea.category}
          </span>
          <h3 className="text-t400">{idea.title}</h3>
        </div>
        <span className="text-n300 whitespace-nowrap" aria-label={`${idea.like_count} Likes`}>
          {idea.like_count} ♥
        </span>
      </div>
      <p className="text-standard whitespace-pre-line">{idea.description}</p>
      <div className="flex flex-wrap items-center justify-between gap-s40">
        <span className="text-small text-subtle">von {idea.author_name}</span>
        <div className="flex flex-wrap items-center gap-s40">
          <Button variant="link" href={`/ideen/${idea.id}/bearbeiten`} aria-label={`«${idea.title}» bearbeiten`}>
            Bearbeiten
          </Button>
          <Button
            variant={liked ? "secondary" : "link"}
            iconLeft={liked ? "check" : undefined}
            isLoading={toggle.isPending}
            onClick={() => toggle.mutate()}
            aria-pressed={liked}
          >
            {liked ? "Gefällt mir" : "Liken"}
          </Button>
        </div>
      </div>
      {toggle.isError && <p className="text-small text-danger">Like konnte nicht gespeichert werden.</p>}
    </article>
  );
}
