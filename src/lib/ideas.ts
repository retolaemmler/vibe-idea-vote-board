import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const CATEGORIES = [
  "Kundenerlebnis",
  "Prozessautomatisierung",
  "Beratung & Anlage",
  "Kredit & Hypotheken",
  "Zahlungsverkehr",
  "Compliance & Risiko",
  "Mitarbeitende & Zusammenarbeit",
  "Daten & KI",
] as const;

export const ideaSchema = z.object({
  author_name: z.string().trim().min(1, "Bitte Namen angeben").max(80),
  title: z.string().trim().min(3, "Mindestens 3 Zeichen").max(120, "Maximal 120 Zeichen"),
  description: z.string().trim().min(10, "Mindestens 10 Zeichen").max(2000, "Maximal 2000 Zeichen"),
  category: z.enum(CATEGORIES, { message: "Bitte Kategorie wählen" }),
});

export type Idea = {
  id: string;
  author_name: string;
  title: string;
  description: string;
  category: string;
  like_count: number;
  created_at: string;
};

export const ideasQuery = queryOptions({
  queryKey: ["ideas"],
  queryFn: async (): Promise<Idea[]> => {
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .order("like_count", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const myLikesQuery = (voterId: string | null) =>
  queryOptions({
    queryKey: ["my-likes", voterId],
    enabled: !!voterId,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase.rpc("my_likes", { _voter_id: voterId! });
      if (error) throw error;
      return (data ?? []) as string[];
    },
  });

const VOTER_KEY = "ideen-voter-id";
const NAME_KEY = "ideen-name";

export function getVoterId() {
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}
export const getStoredName = () => localStorage.getItem(NAME_KEY) ?? "";
export const setStoredName = (n: string) => localStorage.setItem(NAME_KEY, n);
