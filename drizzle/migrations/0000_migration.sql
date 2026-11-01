CREATE TABLE public.ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 80),
  title text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 120),
  description text NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
  category text NOT NULL CHECK (category IN ('Kundenerlebnis','Prozessautomatisierung','Beratung & Anlage','Kredit & Hypotheken','Zahlungsverkehr','Compliance & Risiko','Mitarbeitende & Zusammenarbeit','Daten & KI')),
  like_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ideas TO anon, authenticated;
GRANT ALL ON public.ideas TO service_role;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ideas readable" ON public.ideas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Ideas insertable" ON public.ideas FOR INSERT TO anon, authenticated WITH CHECK (like_count = 0);

CREATE TABLE public.idea_likes (
  idea_id uuid NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (idea_id, voter_id)
);
GRANT ALL ON public.idea_likes TO service_role;
ALTER TABLE public.idea_likes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.toggle_like(_idea_id uuid, _voter_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE liked boolean;
BEGIN
  DELETE FROM idea_likes WHERE idea_id = _idea_id AND voter_id = _voter_id;
  IF FOUND THEN
    UPDATE ideas SET like_count = like_count - 1 WHERE id = _idea_id;
    liked := false;
  ELSE
    INSERT INTO idea_likes(idea_id, voter_id) VALUES (_idea_id, _voter_id);
    UPDATE ideas SET like_count = like_count + 1 WHERE id = _idea_id;
    liked := true;
  END IF;
  RETURN liked;
END $$;

CREATE OR REPLACE FUNCTION public.my_likes(_voter_id uuid)
RETURNS SETOF uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT idea_id FROM idea_likes WHERE voter_id = _voter_id;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_like(uuid, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.my_likes(uuid) TO anon, authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.ideas;