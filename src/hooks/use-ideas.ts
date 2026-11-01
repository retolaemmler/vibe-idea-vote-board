import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getVoterId, ideasQuery, myLikesQuery } from "@/lib/ideas";

export function useIdeas() {
  const qc = useQueryClient();
  const [voterId, setVoterId] = useState<string | null>(null);
  useEffect(() => setVoterId(getVoterId()), []);

  useEffect(() => {
    const ch = supabase
      .channel(`ideas-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "ideas" }, () =>
        qc.invalidateQueries({ queryKey: ["ideas"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const ideas = useQuery(ideasQuery);
  const likes = useQuery(myLikesQuery(voterId));
  return { ideas, likedIds: new Set(likes.data ?? []) };
}
